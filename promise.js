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

    return new mypromise((resolve, reject) => {
      if (this.status == mypromise.PENDING) {
        this.callbacks.push({
          onFulfilled: (value) => {
            try {
              var result = onFulfilled(value);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          },
          onRejected: (value) => {
            try {
              var result = onRejected(value);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          },
        });
      }
      if (this.status == mypromise.FULFILLED) {
        setTimeout(() => {
          try {
            var result = onFulfilled(this.value);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.status == mypromise.REJECTED) {
        setTimeout(() => {
          try {
            var result = onRejected(this.value);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      }
    });
  }
}
