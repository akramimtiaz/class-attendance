// import day from 'dayjs';
// import weekday from 'dayjs/plugin/weekday';

// day.extend(weekday);

// for each class create 3 sessions 
// and for the sessions in the past mark them as completed
// by the teacher for that class
// for the completed sessions - create student attendance records

export const seedData = {
    admins: [
        {
            name: 'Imtiyas Idris',
            email: 'imtiaz@alma.org',
            phoneNumber: '0400 000 00',
        }
    ],
    teachers: [
        {
            name: 'Yusuf Khan',
            email: 'yusuf@alma.org',
            phoneNumber: '0400 000 000',
            classes: [
                {
                    className: 'Beginner Quran',
                    students: [
                        'Aisha Zaid',
                        'Fatima Ali',
                        'Omar Hussein',
                        'Khalid Hassan' 
                    ],
                },
                {
                    className: 'Intermediate Tajweed',
                    students: [
                        'Zainab Ahmad',
                        'Maryam Siddiqui',
                        'Yaqoub Hashimi',
                        'Haikal Arifie',
                    ]
                }
            ]
        },
        {
            name: 'Ahmed Ali',
            email: 'ahmed@alma.org',
            phoneNumber: '0400 000 000',
            classes: [
                {
                    className: 'Advanced Memorization',
                    students: [
                        'Mohammed Ibrahim',
                        'Zaid Shakir',
                        'Karim Zaid',
                        'Farid Bahrani',
                    ]
                },
                {
                    className: 'Arabic Language',
                    students: [
                        'Suwaida Khalid',
                        'Rawdah Haneeah',
                        'Safwan Mubarak',
                        'Tariq Ramadan',
                    ]
                }
            ]
        },
    ]
}