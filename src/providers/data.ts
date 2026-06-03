import {
  DataProvider,
  GetListParams,
  GetListResponse,
  BaseRecord,
} from '@refinedev/core';

export interface MockSubject {
  id: number;
  courseCode: string;
  name: string;
  dept: string;
  briefDescription: string;
}

export const mockSubjects: MockSubject[] = [
  {
    id: 1,
    courseCode: 'CS101',
    name: 'Introduction to Computer Science',
    dept: 'CS',
    briefDescription: 'An introduction to the fundamentals of computer science, algorithmic thinking, and programming using modern languages.',
  },
  {
    id: 2,
    courseCode: 'MATH201',
    name: 'Linear Algebra',
    dept: 'Math',
    briefDescription: 'Covers systems of linear equations, matrices, determinants, vector spaces, linear transformations, eigenvalues, and eigenvectors.',
  },
  {
    id: 3,
    courseCode: 'ENG102',
    name: 'English Composition',
    dept: 'English',
    briefDescription: 'Focuses on developing critical reading, writing, and research skills through analyzing complex texts and writing academic essays.',
  },
];

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord>({
    resource,
    pagination,
    filters,
    sorters,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== 'subjects') {
      return { data: [] as TData[], total: 0 };
    }

    let data = mockSubjects.map((subj) => ({
      id: subj.id,
      code: subj.courseCode,
      name: subj.name,
      department: {
        name: subj.dept,
      },
      description: subj.briefDescription,
      createdAt: new Date().toISOString(),
    }));

    // Apply filters
    if (filters) {
      for (const filter of filters) {
        if ('field' in filter && filter.value !== undefined && filter.value !== null && filter.value !== '') {
          const { field, operator, value } = filter;
          if (field === 'department' || field === 'department.name') {
            data = data.filter((item) => item.department.name === value);
          } else if (field === 'name') {
            if (operator === 'contains') {
              data = data.filter((item) =>
                item.name.toLowerCase().includes(String(value).toLowerCase())
              );
            } else {
              data = data.filter((item) => item.name === value);
            }
          }
        }
      }
    }

    // Apply sorters
    if (sorters && sorters.length > 0) {
      const sorter = sorters[0];
      const { field, order } = sorter;
      data.sort((a, b) => {
        let valA = (a as any)[field];
        let valB = (b as any)[field];

        if (field === 'department' || field === 'department.name') {
          valA = a.department.name;
          valB = b.department.name;
        }

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === 'string' && typeof valB === 'string') {
          return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        return order === 'asc' ? (valA > valB ? 1 : -1) : (valB > valA ? 1 : -1);
      });
    }

    // Compute total length after filtering/sorting but before paging
    const total = data.length;

    // Apply pagination
    const current = pagination?.currentPage ?? 1;
    const pageSize = pagination?.pageSize ?? 10;

    if (pagination?.mode !== 'client') {
      const start = (current - 1) * pageSize;
      const end = start + pageSize;
      data = data.slice(start, end);
    }

    return {
      data: data as unknown as TData[],
      total,
    };
  },
  getOne: async () => {
    throw new Error('This function is not present in mock');
  },
  create: async () => {
    throw new Error('This function is not present in mock');
  },
  update: async () => {
    throw new Error('This function is not present in mock');
  },
  deleteOne: async () => {
    throw new Error('This function is not present in mock');
  },
  getApiUrl: () => '',
};
