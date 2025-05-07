// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];

//   Comparing Date data 
//   const today = Date.now();
//   const dueDate = Date.parse(AssignmentGroup.assignments[2].due_at);
//   console.log(today)
//   console.log(dueDate);

  function validateIdMatch(course, ag){
    if(ag.course_id !== course.id){
      throw new Error("Invalid Course ID!");
      
    }
  }

  function validateDateFormat(ag, submissions) {
    const pattern = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
    ag.assignments.forEach(element => {
      if(!pattern.test(element.due_at)){
        throw new Error("Invalid Due Date Format!");
      }
    });

    submissions.forEach(el => {
      if(!pattern.test(el.submission.submitted_at)){
        throw new Error("Invalid Date Submitted Format!");
      }
    });
  }
  function getLearnerData(course, ag, submissions) {
    // here, we would process this data to achieve the desired result.
    try {
    const learners = [];
    let objTemplate = {};
    validateIdMatch(course, ag);
    validateDateFormat(ag, submissions);

    // initializing a learner's max score
    let maxScore = 0;

    // initializing a learner's cumulative score
    let cumulative = 0;

    // Creating an array of unique students.
    for (let i = 0; i < submissions.length; i++) {
        let isUniqe = true;
        for (let j = 0; j < learners.length; j++) {
            if (submissions[i].learner_id === learners[j]) {
                isUniqe = false;
            }
            
        }
        if (!isUniqe) {
            continue;
        }
        learners.push(submissions[i].learner_id);
        
    }
    // console.log(learners);

    // Making an empty results array.
    const arr = [];
    // console.log(arr);

    const notYetDue = [];
    for (let i = 0; i < ag.assignments.length; i++) {
        if (Date.parse(ag.assignments[i].due_at) > Date.now()) {
            notYetDue.push(ag.assignments[i].id);
        }
        
    }
    // console.log(notYetDue)
    // Declaring a learner's max score
    for (let i = 0; i < ag.assignments.length; i++) {
        if (Date.parse(ag.assignments[i].due_at) > Date.now()) {
            continue;
        }
        maxScore += ag.assignments[i].points_possible;
    }
    // console.log(maxScore);

    const isNotYetDue = function(id, notYetDue){
        for (let k = 0; k < notYetDue.length; k++) {
            if (id === notYetDue[k]) {
                return true;
            }
        }
        return false;
    };
    

    for (let i = 0; i < learners.length; i++) {
        objTemplate['id'] = learners[i];
        for (let j = 0; j < submissions.length; j++) {
            if (submissions[j].learner_id === learners[i]) {
                
                if (isNotYetDue(submissions[j].assignment_id, notYetDue)) {
                    continue;
                }

                
                objTemplate[submissions[j].assignment_id] = submissions[j].submission.score;
                for (const el of ag.assignments) {
                    if (el.id === submissions[j].assignment_id) {
                        if (Date.parse(submissions[j].submission.submitted_at) > Date.parse(el.due_at)) {
                            objTemplate[submissions[j].assignment_id] -= el.points_possible * 0.1;
                        }
                        objTemplate[submissions[j].assignment_id] /= el.points_possible;
                    }
                }
                objTemplate[submissions[j].assignment_id] = Number(objTemplate[submissions[j].assignment_id].toFixed(3));
            }
            
        }
        // Declaring a learner's cumulative score
        for (let k = 0; k < submissions.length; k++) {
            if (isNotYetDue(submissions[k].assignment_id, notYetDue)) {
                continue;
            }
            if(submissions[k].learner_id === learners[i]){
                cumulative += submissions[k].submission.score;
                for (let n = 0; n < ag.assignments.length; n++) {
                    if (Date.parse(submissions[k].submission.submitted_at) > Date.parse(ag.assignments[n].due_at) && ag.assignments[n].id === submissions[k].assignment_id) {
                        cumulative -= ag.assignments[n].points_possible * 0.1;
                    }
                    
                }
            }
            
        }
        // console.log(cumulative / maxScore);
        objTemplate['avg'] = cumulative / maxScore;
        cumulative = 0;
        // console.log(objTemplate);
        arr.push(objTemplate);
        objTemplate = {};
        // console.log(arr);
       
    }

    // const result = [
    //   {
    //     id: 125,
    //     avg: 0.985, // (47 + 150) / (50 + 150)
    //     1: 0.94, // 47 / 50
    //     2: 1.0 // 150 / 150
    //   },
    //   {
    //     id: 132,
    //     avg: 0.82, // (39 + 125) / (50 + 150)
    //     1: 0.78, // 39 / 50
    //     2: 0.833 // late: (140 - 15) / 150
    //   }
    // ];
  
    return arr;
  } catch (error) {
    console.log(error.message)
  }
  }


  
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  
  console.log(result);
  