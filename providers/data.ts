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
  }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== 'subjects') {
      return { data: [] as TData[], total: 0 };
    }

    const data = mockSubjects.map((subj) => ({
      id: subj.id,
      code: subj.courseCode,
      name: subj.name,
      department: {
        name: subj.dept,
      },
      description: subj.briefDescription,
      createdAt: new Date().toISOString(),
    }));

    return {
      data: data as unknown as TData[],
      total: data.length,
    };
  },
  getOne: async () => { throw new Error("This function is not present in mock") },
  create: async () => { throw new Error("This function is not present in mock") },
  update: async () => { throw new Error("This function is not present in mock") },
  deleteOne: async () => { throw new Error("This function is not present in mock") },
  getApiUrl: () => '',
};
