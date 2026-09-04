(() => {
    const HOVER_DELAY_MS = 400;

    let timer = null;
    let activeTarget = null;

    const tooltip = document.createElement("div");

    tooltip.className = "nav-help-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.setAttribute("data-visible", "false");

    document.body.appendChild(tooltip);

    function positionTooltip(target) {
        const targetRect = target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const margin = 12;

        let left =
            targetRect.left +
            (targetRect.width / 2) -
            (tooltipRect.width / 2);

        left = Math.max(
            margin,
            Math.min(
                left,
                window.innerWidth - tooltipRect.width - margin
            )
        );

        let top = targetRect.bottom + 10;

        if (top + tooltipRect.height > window.innerHeight - margin) {
            top = targetRect.top - tooltipRect.height - 10;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    function showTooltip(target, immediate = false) {
        clearTimeout(timer);

        const show = () => {
            activeTarget = target;
            tooltip.textContent = target.dataset.navHelp;
            tooltip.setAttribute("data-visible", "true");
            positionTooltip(target);
        };

        if (immediate) {
            show();
        } else {
            timer = window.setTimeout(show, HOVER_DELAY_MS);
        }
    }

    function hideTooltip(target) {
        clearTimeout(timer);

        if (!activeTarget || activeTarget === target) {
            activeTarget = null;
            tooltip.setAttribute("data-visible", "false");
        }
    }

    document.querySelectorAll("[data-nav-help]").forEach((target, index) => {
        const id = `nav-help-${index + 1}`;

        target.setAttribute("aria-describedby", id);

        target.addEventListener(
            "mouseenter",
            () => showTooltip(target)
        );

        target.addEventListener(
            "mouseleave",
            () => hideTooltip(target)
        );

        target.addEventListener(
            "focus",
            () => showTooltip(target, true)
        );

        target.addEventListener(
            "blur",
            () => hideTooltip(target)
        );
    });

    window.addEventListener("resize", () => {
        if (activeTarget) {
            positionTooltip(activeTarget);
        }
    });

    window.addEventListener(
        "scroll",
        () => {
            if (activeTarget) {
                positionTooltip(activeTarget);
            }
        },
        true
    );
})();
