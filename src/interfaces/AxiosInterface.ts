interface AxiosAddProjectObject {
  id: number,
  last_modified: string
}

interface AxiosAddProject {
  success: boolean,
  message: string,
  object: AxiosAddProjectObject,
  code: number
}

interface AxiosObjectReturn {
  data: AxiosAddProject | null,
  status: number,
  statusText: string,
  headers: Object,
  config: Object,
  request: Object
}

export {
  AxiosAddProject,
  AxiosObjectReturn,
  AxiosAddProjectObject,
}
