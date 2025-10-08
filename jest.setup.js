import '@testing-library/jest-dom'

global.fetch = jest.fn()

if (typeof Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init) {
      this.url = typeof input === 'string' ? input : input.url
      this.method = init?.method || 'GET'
      this.headers = new Headers(init?.headers)
      this.body = init?.body
    }
  }
}

if (typeof Symbol.for('request.cookies') === 'undefined') {
  Object.defineProperty(Symbol, 'request.cookies', {
    value: Symbol.for('request.cookies')
  })
}

if (typeof Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body
      this.init = init
      this.status = init?.status || 200
      this.ok = this.status >= 200 && this.status < 300
      this.headers = new Headers(init?.headers)
    }
    
    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body
    }
    
    async text() {
      return typeof this.body === 'string' ? this.body : JSON.stringify(this.body)
    }
    
    static json(data, init) {
      return new Response(JSON.stringify(data), {
        ...init,
        status: init?.status || 200,
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      })
    }
  }
}

if (typeof Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init) {
      this.map = new Map()
      if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this.map.set(key.toLowerCase(), value)
        })
      }
    }
    
    get(name) {
      return this.map.get(name.toLowerCase())
    }
    
    set(name, value) {
      this.map.set(name.toLowerCase(), value)
    }
    
    has(name) {
      return this.map.has(name.toLowerCase())
    }
  }
}
