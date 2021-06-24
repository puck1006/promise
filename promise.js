class mypromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(executor) {
    this.status = mypromise.PENDING;
    this.value = null;
    this.callbacks = [];

    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(value) {
    if (this.status == mypromise.PENDING) {
      this.status = mypromise.FULFILLED;
      this.value = value;
      setTimeout(() => {
        this.callbacks.map((callback) => {
          callback.onFulfilled(this.value);
        });
      });
    }
  }
  reject(reason) {
    if (this.status == mypromise.PENDING) {
      this.status = mypromise.REJECTED;
      this.value = reason;
      setTimeout(() => {
        this.callbacks.map((callback) => {
          callback.onRejected(this.value);
        });
      });
    }
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled != "function") {
      onFulfilled = (value) => value;
    }
    if (typeof onRejected != "function") {
      onRejected = (value) => value;
    }

    let promise = new mypromise((resolve, reject) => {
      if (this.status == mypromise.PENDING) {
        this.callbacks.push({
          onFulfilled: (value) => {
            this.parse(promise, onFulfilled(value), resolve, reject);
          },
          onRejected: (value) => {
            this.parse(promise, onRejected(value), resolve, reject);
          },
        });
      }
      if (this.status == mypromise.FULFILLED) {
        setTimeout(() => {
          this.parse(promise, onFulfilled(this.value), resolve, reject);
        });
      }
      if (this.status == mypromise.REJECTED) {
        setTimeout(() => {
          this.parse(promise, onRejected(this.value), resolve, reject);
        });
      }
    });

    return promise;
  }

  parse(promise, result, resolve, reject) {
    if (promise == result) {
      throw new TypeError("Chaining cycle detected for promise");
    }
    try {
      if (result instanceof mypromise) {
        result.then(resolve, reject);
      } else {
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  }
}
