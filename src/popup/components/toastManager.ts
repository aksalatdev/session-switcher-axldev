import { CSS_CLASSES } from "@popup/utils/constants";

export type ToastType = "success" | "error" | "info";

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

export class ToastManager {
  private container: HTMLElement | null = null;
  private timeout: ReturnType<typeof setTimeout> | null = null;

  private getContainer(): HTMLElement {
    if (!this.container) {
      this.container = document.getElementById("toastContainer");
      if (!this.container) {
        this.container = document.createElement("div");
        this.container.id = "toastContainer";
        this.container.className = "toast-container";
        document.body.appendChild(this.container);
      }
    }
    return this.container;
  }

  show({ message, type = "success", duration = 2500 }: ToastOptions): void {
    const container = this.getContainer();

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    const icon = this.getIcon(type);
    container.innerHTML = `
      <div class="toast toast-${type} ${CSS_CLASSES.SHOW}">
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;

    this.timeout = setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide(): void {
    const container = this.getContainer();
    const toast = container.querySelector(".toast");
    if (toast) {
      toast.classList.remove(CSS_CLASSES.SHOW);
      toast.classList.add("hiding");
      setTimeout(() => {
        container.innerHTML = "";
      }, 200);
    }
  }

  success(message: string): void {
    this.show({ message, type: "success" });
  }

  error(message: string): void {
    this.show({ message, type: "error", duration: 4000 });
  }

  info(message: string): void {
    this.show({ message, type: "info" });
  }

  private getIcon(type: ToastType): string {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "info":
        return "ℹ";
    }
  }
}
