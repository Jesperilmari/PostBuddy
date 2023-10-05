export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  login: {
    user: User;
    token: string;
  };
}

export interface RegisterResponse {
  register: {
    user: User;
    token: string;
  };
}

export interface AlertInput {
  active: boolean;
  alert: {
    severity: "success" | "info" | "warning" | "error";
    message?: string | "alert";
    title?: string | null;
    onClose?: boolean;
    timeout?: number;
    variant?: "outlined" | "filled" | "standard";
  };
}

export interface IStack<T> {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  size(): number;
}

export class Stack<T> implements IStack<T> {
  private storage: T[] = [];

  constructor(private capacity: number = Infinity) {}

  push(item: T): void {
    if (this.size() === this.capacity) {
      throw Error("Stack has reached max capacity, you cannot add more items");
    }
    this.storage.push(item);
  }

  pop(): T | undefined {
    return this.storage.pop();
  }

  peek(): T | undefined {
    return this.storage[this.size() - 1];
  }

  size(): number {
    return this.storage.length;
  }
  isEmpty(): boolean {
    if (this.storage.length === 0) {
      return true;
    }
    return false;
  }
}

export interface AlertInput {
  active: boolean;
  alert: {
    severity: "success" | "info" | "warning" | "error";
    message?: string | "alert";
    title?: string | null;
    onClose?: boolean;
    timeout?: number;
    variant?: "outlined" | "filled" | "standard";
  };
}
