import { LONG_PRESS_MS, MOBILE_QUERY } from "./config.js";

const DRAG_THRESHOLD = 4;
const AUTO_SCROLL_EDGE_PX = 78;
const AUTO_SCROLL_MAX_SPEED = 4.2;

const isMobileViewport = () => window.matchMedia(MOBILE_QUERY).matches;


export function makeSortable({
  container,
  itemSelector,
  handleSelector = itemSelector,
  getId,
  placeholderClass,
  draggingClass,
  shadow = "0 12px 28px #302b4033",
  isMobileReorderEnabled = () => false,
  onReorder,
  onCancel,
  onLongPress,
  onKeyMove,
}) {
  let drag = null;
  let suppressClick = false;
  let releasePointerId = null;

  const getOrder = () => [...container.querySelectorAll(itemSelector)].map(getId);

  container.addEventListener(
    "click",
    (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.stopPropagation();
      event.preventDefault();
    },
    true,
  );

  
  
  container.addEventListener(
    "touchmove",
    (event) => {
      if (isMobileViewport() && isMobileReorderEnabled()) {
        event.preventDefault();
      }
    },
    { passive: false },
  );

  function stopAutoScroll(state = drag) {
    if (state?.autoScrollFrame) {
      cancelAnimationFrame(state.autoScrollFrame);
      state.autoScrollFrame = null;
    }
  }

  container.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || !event.isPrimary) return;
    const handle = event.target.closest(handleSelector);
    const item = handle?.closest(itemSelector);
    if (!item || !container.contains(item)) return;

    const mobile = isMobileViewport();
    const mobileReorderActive = mobile && isMobileReorderEnabled();
    const canDrag = !mobile || mobileReorderActive;
    const bounds = item.getBoundingClientRect();

    
    
    
    const exactWidth = item.offsetWidth || Math.round(bounds.width);
    const exactHeight = item.offsetHeight || Math.round(bounds.height);
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const exactLeft = centerX - exactWidth / 2;
    const exactTop = centerY - exactHeight / 2;

    drag = {
      item,
      handle,
      id: getId(item),
      pointerId: event.pointerId,
      canDrag,
      horizontal: mobile,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      grabX: event.clientX - exactLeft,
      grabY: event.clientY - exactTop,
      lockY: Math.round(exactTop),
      width: exactWidth,
      height: exactHeight,
      scrollExact: container.scrollLeft,
      moved: false,
      originalOrder: getOrder(),
      placeholder: null,
      timer: null,
      autoScrollFrame: null,
    };

    if (canDrag) {
      try {
        handle.setPointerCapture(event.pointerId);
      } catch {
        
      }
      if (mobileReorderActive) {
        event.stopPropagation();
        startDrag();
      }
    }

    if (onLongPress && !mobileReorderActive) {
      drag.timer = window.setTimeout(() => {
        if (!drag || drag.moved) return;
        const { id, pointerId, startX, startY } = drag;
        stopAutoScroll(drag);
        drag = null;
        suppressClick = true;
        releasePointerId = pointerId;
        onLongPress(id, startX, startY);
      }, LONG_PRESS_MS);
    }
  });

  container.addEventListener("keydown", (event) => {
    if (!onKeyMove || !event.altKey || !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      return;
    }
    const item = event.target.closest(handleSelector)?.closest(itemSelector);
    if (!item) return;
    event.preventDefault();
    const offset = event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1;
    onKeyMove(getId(item), offset);
  });

  function positionDraggedItem() {
    if (!drag || !drag.moved) return;
    const { item, horizontal, width, lockY } = drag;
    if (horizontal) {
      const minX = 6;
      const maxX = Math.max(minX, window.innerWidth - width - 6);
      const clampedX = Math.max(minX, Math.min(maxX, drag.lastX - drag.grabX));
      item.style.left = `${clampedX}px`;
      item.style.top = `${lockY}px`;
    } else {
      item.style.left = `${drag.lastX - drag.grabX}px`;
      item.style.top = `${drag.lastY - drag.grabY}px`;
    }
  }

  function startDrag() {
    if (!drag || drag.moved) return;
    const { item, width, height, horizontal } = drag;
    drag.moved = true;
    drag.scrollExact = container.scrollLeft;

    const placeholder = document.createElement("div");
    placeholder.className = placeholderClass;
    placeholder.setAttribute("aria-hidden", "true");
    placeholder.style.height = `${height}px`;
    if (horizontal) {
      placeholder.style.width = `${width}px`;
      placeholder.style.flex = `0 0 ${width}px`;
    }
    drag.placeholder = placeholder;

    item.replaceWith(placeholder);
    document.body.append(item);
    item.classList.add(draggingClass);
    Object.assign(item.style, {
      position: "fixed",
      width: `${width}px`,
      height: `${height}px`,
      margin: "0",
      zIndex: "55",
      pointerEvents: "none",
      boxShadow: shadow,
      transform: "scale(1.05)",
      transition: "transform 160ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 160ms ease",
    });
    positionDraggedItem();

    if (horizontal) {
      startAutoScrollLoop();
    }
  }

  function resetStyle(item) {
    item.classList.remove(draggingClass);
    for (const property of [
      "position",
      "width",
      "height",
      "margin",
      "left",
      "top",
      "z-index",
      "transform",
      "transition",
      "box-shadow",
      "pointer-events",
    ]) {
      item.style.removeProperty(property);
    }
  }

  function animatePlaceholderTo(placeholder, beforeNode) {
    if (beforeNode === placeholder || placeholder.nextElementSibling === beforeNode) {
      return;
    }

    const horizontal = drag?.horizontal ?? isMobileViewport();
    const siblings = [...container.querySelectorAll(itemSelector)].filter((el) => el !== placeholder);

    const measure = (element) => {
      const rect = element.getBoundingClientRect();
      return horizontal ? rect.left : rect.top;
    };

    const beforePositions = new Map(siblings.map((el) => [el, measure(el)]));
    container.insertBefore(placeholder, beforeNode);

    for (const el of siblings) {
      const delta = beforePositions.get(el) - measure(el);
      if (Math.abs(delta) < 0.5) continue;
      el.style.transition = "none";
      el.style.transform = horizontal
        ? `translate3d(${delta}px, 0, 0)`
        : `translate3d(0, ${delta}px, 0)`;
      el.getBoundingClientRect();
      requestAnimationFrame(() => {
        el.style.transition = "transform 230ms cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "";
      });
    }
  }

  function updateSwapByGeometry() {
    if (!drag || !drag.moved) return;
    const { item, placeholder, horizontal } = drag;

    const siblings = [...container.querySelectorAll(itemSelector)].filter((el) => el !== placeholder);
    if (!siblings.length) return;

    const dragRect = item.getBoundingClientRect();
    const dragCenter = horizontal
      ? dragRect.left + dragRect.width / 2
      : dragRect.top + dragRect.height / 2;

    let insertBeforeNode = null;
    for (const sibling of siblings) {
      const rect = sibling.getBoundingClientRect();
      const siblingCenter = horizontal
        ? rect.left + rect.width / 2
        : rect.top + rect.height / 2;
      if (dragCenter < siblingCenter) {
        insertBeforeNode = sibling;
        break;
      }
    }

    animatePlaceholderTo(placeholder, insertBeforeNode);
  }

  function startAutoScrollLoop() {
    stopAutoScroll();
    const step = () => {
      if (!drag || !drag.moved) return;
      if (drag.horizontal && container.scrollWidth > container.clientWidth) {
        const rect = container.getBoundingClientRect();
        const itemRect = drag.item.getBoundingClientRect();
        const dragCenterX = itemRect.left + itemRect.width / 2;

        const leftProbe = Math.min(drag.lastX, itemRect.left + 18, dragCenterX);
        const rightProbe = Math.max(drag.lastX, itemRect.right - 18, dragCenterX);

        const leftZone = rect.left + AUTO_SCROLL_EDGE_PX;
        const rightZone = rect.right - AUTO_SCROLL_EDGE_PX;
        let speed = 0;

        if (leftProbe < leftZone && container.scrollLeft > 0) {
          const ratio = Math.min(1, Math.max(0, (leftZone - leftProbe) / AUTO_SCROLL_EDGE_PX));
          speed = -(ratio * ratio * AUTO_SCROLL_MAX_SPEED);
        } else if (
          rightProbe > rightZone &&
          container.scrollLeft < container.scrollWidth - container.clientWidth
        ) {
          const ratio = Math.min(1, Math.max(0, (rightProbe - rightZone) / AUTO_SCROLL_EDGE_PX));
          speed = ratio * ratio * AUTO_SCROLL_MAX_SPEED;
        }

        if (Math.abs(speed) > 0.05) {
          const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
          drag.scrollExact = Math.max(0, Math.min(maxScroll, drag.scrollExact + speed));
          const prevScroll = container.scrollLeft;
          container.scrollLeft = Math.round(drag.scrollExact);
          if (container.scrollLeft !== prevScroll) {
            updateSwapByGeometry();
          }
        } else {
          drag.scrollExact = container.scrollLeft;
        }
      }
      drag.autoScrollFrame = requestAnimationFrame(step);
    };
    drag.autoScrollFrame = requestAnimationFrame(step);
  }

  window.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;

    if (!drag.moved) {
      const dist = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
      if (dist < DRAG_THRESHOLD) return;

      window.clearTimeout(drag.timer);

      if (!drag.canDrag) {
        drag = null;
        return;
      }

      startDrag();
    }

    positionDraggedItem();
    updateSwapByGeometry();
  });

  function finish(event) {
    if (event.pointerId === releasePointerId) {
      releasePointerId = null;
      window.setTimeout(() => {
        suppressClick = false;
      }, 0);
    }
    if (!drag || event.pointerId !== drag.pointerId) return;

    const { item, placeholder, moved, originalOrder, timer } = drag;
    window.clearTimeout(timer);
    stopAutoScroll(drag);
    drag = null;
    if (!moved) return;

    if (placeholder?.isConnected) placeholder.replaceWith(item);
    else item.remove();
    resetStyle(item);

    if (event.type === "pointercancel") {
      onCancel?.();
      return;
    }

    const order = getOrder();
    if (order.every((id, index) => id === originalOrder[index])) return;
    suppressClick = true;
    window.setTimeout(() => {
      suppressClick = false;
    }, 0);
    onReorder(order);
  }

  window.addEventListener("pointerup", finish);
  window.addEventListener("pointercancel", finish);

  return { isDragging: () => drag !== null && drag.moved };
}