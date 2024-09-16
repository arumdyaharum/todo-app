import Axios from 'axios';
import { defineStore } from 'pinia'

const instance = Axios.create({
  baseURL: import.meta.env.VITE_BASEURL
})

instance.interceptors.request.use(
  config => {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response; 
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const useStore = defineStore('store', {
  state: () => {
    return {
      isError: false,
      errorMessage: '',
      todos: [],
      projects: [],
      projectId: null,
      projectName: null,
      projectPrefix: null,
    }
  },
  getters: {},
  actions: {
    closeErrorPopup() {
      const message = this.errorMessage
      this.isError = false
      this.errorMessage = ''
      if (message.includes('expired')) {
        window.location = "/login";
      }
    },
    async doLogin(email, password) {
      try {
        const { data } = await instance.post('/auth/login', {
          email,
          password,
        });
        localStorage.setItem('access_token', data.token);
        Axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return true
      } catch(err) {
        console.error("Error:", err);
        this.isError = true
        this.errorMessage = err.response.data.message
        return false
      }
    },
    async doRegister(name, email, password) {
      try {
        const { data } = await instance.post('/auth/register', {
          name,
          email,
          password,
        })
        return true
      } catch(err) {
        console.error("Error:", err.response.data);
        this.isError = true
        this.errorMessage = err.response.data.message
        return false
      }
    },
    async createTodo(title, project_prefix) {
      try {
        const { data } = await instance.post('/todo', {
          title,
          project_prefix,
        })
        if (data.todo_id) {
          this.getTodos(this.projectName);
        }
      } catch(err) {
        console.error("Error:", err.response.data);
        this.isError = true
        this.errorMessage = err.response.data.message
        return false
      }
    },
    async getTodos(projectName = null) {
      try {
        const { data } = await instance.get(`/todo/all${projectName ? '?projectName=' + projectName : ''}`);
        this.todos = data.data;
      } catch(err) {
        console.error("Error:", err.response.data);
        this.isError = true
        this.errorMessage = err.response.data.message
        return false
      }
    },
    async editTodo(id, title) {
      try {
        const { data } = await instance.put(`/todo/${id}`, {
          title,
        });
        this.todos = this.todos.map(x => {
          if (x.id === data.data.id) {
            x.title = title
          }
          return x
        });
      } catch(err) {
        console.error("Error:", err.response.data);
        this.isError = true
        this.errorMessage = err.response.data.message
        return false
      }
    },
    async changeCompleted(id, completed) {
      try {
        const { data } = await instance.put(`/todo/${id}`, {
          completed,
        });
        this.todos = this.todos.map(x => {
          if (x.id === data.data.id) {
            x.completed = completed
          }
          return x
        });
      } catch(err) {
        console.error("Error:", err.response.data);
        this.isError = true
        this.errorMessage = err.response.data.message
        return false
      }
    },
    async deleteTodo(id) {
      try {
        const { data } = await instance.delete(`/todo/${id}`);
        if (data.todo_id) {
          this.todos = this.todos.filter(x => x.id !== id);
        }
      } catch(err) {
        console.error("Error:", err.response.data);
        this.isError = true
        this.errorMessage = err.response.data.message
        return false
      }
    },
    async getProjects() {
      try {
        const { data } = await instance.get('/project/all');
        this.projects = data.data;
      } catch(err) {
        console.error("Error:", err.response.data);
        this.isError = true
        this.errorMessage = err.response.data.message
        return false
      }
    },
    async createProject(name) {
      try {
        const { data } = await instance.post('/project', { name });

        if (data.project_id) {
          this.getProjects();
        }
      } catch(err) {
        console.error("Error:", err.response.data);
        this.isError = true
        this.errorMessage = err.response.data.message
        return false
      }
    },
    async editProject(id, name) {
      try {
        const { data } = await instance.put(`/project/${id}`, {
          name
        });

        if (data.data.id) {
          this.getProjects();
          this.getTodos();
        }
      } catch(err) {
        console.error("Error:", err.response.data);
        this.isError = true
        this.errorMessage = err.response.data.message
        return false
      }
    },
    async deleteProject(id) {
      try {
        const { data } = await instance.delete(`/project/${id}`);
        if (data.project_id) {
          this.getProjects();
          this.getTodos();
        }
      } catch(err) {
        console.error("Error:", err.response.data);
        this.isError = true
        this.errorMessage = err.response.data.message
        return false
      }
    }
  },
})