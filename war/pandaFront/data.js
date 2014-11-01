var Data = {notifications : [{date:1413990281200, text:"welcome to panda", target:""}, 
					 {date:1413990281200, text:"start your training", target:"training"}, 
					 {date:1413990281200,  text:"see your calendar", target:"calendar"}],
			 calls: [       {
	                "id": 293,
	                "title": "My first call",
	                "url": "#",
	                "class": "event-info",
	                "start": 1414099475430, // Milliseconds
	                "end": 1414169608967 // Milliseconds
	            }],
		        profile: {
		        	name: 'John',
		        	lastName: 'doe',
		        	email: 'john.doe@gmail.com',
		        	address: 'Tel-aviv',
		        	specialty: 'Immunologist',
		        	lang:'English',
		        	callHour:'Evening (16:00-20:00)',
		        	callFreq:'Once a month',
		        	foi: {cancer:true, ed:true},
		        	scheduleBy:{email:true, appNotification:true}
		        },
		        degreesList: ['Ecology, Evolution & Behavior',
		                      'Human Biology',
		                      'Marine & Freshwater Biology',
		                      'Microbiology',
		                      'Cell & Molecular Biology',
		                      'Neurobiology',
		                      'Plant Biology',
		                      'Teaching',
		                      'Biology Honors',
		                      'Computational Biology',
		                      'Other'
		        ],
                currentCall:{
                	resoucres:[{name: 'panda-demo', urls:[ '../res/panda/1.jpg', '../res/panda/2.jpg','../res/panda/3.jpg','../res/panda/4.jpg','../res/panda/5.jpg']}],
                	id: '123456'
                },
                trainings:[{name: 'Diabetes', dueDate:1415003184478, desc:'In this course you will learn the basics about Diabetes',
                			resources:[{name: 'Video lesson', url:'', completed: true, type:'video'},
                			           {name: 'lesson 2', url:'', completed: true},
                			           {name: 'lesson 3', url:''}]},
                           {name: 'Diabetes market landscape', dueDate:1415262384478, desc:'In this course you will learn the about the Diabetes medicine sale strategy ',
			        	    resources:[{name: 'lesson 1', url:''},
			        	               {name: 'lesson 2', url:''},
			        	               {name: 'lesson 3', url:''}]},
                           {name: 'Humalog', dueDate:1415348784478, resources:[{name: 'lesson 1', url:''},{name: 'lesson 2', url:''},{name: 'lesson 3', url:''}]},
                           {name: 'Alimta', dueDate:1417940784478, resources:[{name: 'lesson 1', url:''},{name: 'lesson 2', url:''},{name: 'lesson 3', url:''}]
                }],
                whatsNew:[{ text:"Create a training for Actos", target:"uploads", product:"Actos"}, 
      					 { text:"Call bank is almost empty, buy more calls", target:"buy-calls"}
      			],
      			products:[{name: 'Lipitor', types:['A','B','C'], articals:['A','B','C'], matirials:['E','F','G']},
      			          {name: 'Nexium', types:['A','B','C'], articals:['A','B','C'], matirials:['E','F','G']} ,
      			          {name: 'Plavix', types:['A','B','C'], articals:['A','B','C'], matirials:['E','F','G']} ,
      			          {name: 'Abilify', types:['A','B','C'], articals:['A','B','C'], matirials:['E','F','G']} ,
      			          {name: 'Actos', types:['A','B','C'], articals:['A','B','C'], matirials:['E','F','G']}
      			],
      			resourceTypes:['Video','Presentation','Document'
      			],
      			companyInfo:{name:'Lilo', products: 5, medReps: 35, deliveredCalls:56, totalCalls:100, docCalls:4  },
      			specialties:['Cardiologist','Dermatologist','Endocrinologist','Gynaecologist','Immunologist','Neurosurgeon',
							'Oncologist','Parasitologist','Pathologist','Pediatrician','Psychiatrist','Radiologist','Surgeon',
							'Urologist'],
				features: ['Sampels', 'Medical Letter', 'Acticals and Promotion matirials']
                }
                
					 
