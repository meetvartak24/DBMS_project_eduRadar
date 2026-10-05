import { blankRecord } from '../constants/records.js';
const demoSubjects = [
  'Database Management Systems',
  'Computer Networks',
  'Java Programming',
  'Artificial Intelligence',
  'Operating Systems',
  'Web Technology',
];
export const demo = {
  profile: {
    id: 1,
    name: 'Rahul Sharma',
    identifier: 'CE2024032',
    branch: 'Computer Engineering',
    division: 'B',
    semester: 6,
    academic_year: '2026–27',
    email: 'rahul@example.edu',
  },
  records: demoSubjects.map((name, i) => {
    const faculties =
      i === 0
        ? [
            { id: 101, name: 'Dr. A. Patil', email: 'patil@example.edu' },
            { id: 102, name: 'Prof. M. Joshi', email: 'joshi@example.edu' },
          ]
        : [
            {
              id: 101 + i,
              name: [
                'Dr. A. Patil',
                'Prof. M. Joshi',
                'Prof. S. Kulkarni',
                'Prof. P. Deshmukh',
                'Prof. R. Shah',
                'Prof. N. Mehta',
              ][i],
              email: 'faculty@example.edu',
            },
          ];
    return {
      ...blankRecord,
      subject_id: i + 1,
      name,
      code: ['CS601', 'CS602', 'CS603', 'CS604', 'CS605', 'CS606'][i],
      semester: 6,
      credits: 3,
      mse: [26, 22, 27, 25, 24, 28][i],
      ese: [60, 54, 63, 58, 58, 65][i],
      attended: [42, 38, 40, 35, 39, 44][i],
      classes: [48, 45, 44, 40, 43, 46][i],
      assignments: 10,
      submitted: i % 2 ? 10 : 9,
      practicals: 12,
      completed: i % 2 ? 12 : 11,
      faculties,
      faculty_ids: faculties.map((f) => f.id),
      faculty_name: faculties.map((f) => f.name).join(', '),
      faculty_email: faculties.map((f) => f.email).join(', '),
    };
  }),
  events: [
    {
      id: 1,
      name: 'Smart India Hackathon',
      event_date: '2026-09-12',
      status: 'Participated',
      certificate: '',
    },
    {
      id: 2,
      name: 'Campus Codeathon',
      event_date: '2026-08-24',
      status: 'Winner',
      certificate: '',
    },
  ],
};
