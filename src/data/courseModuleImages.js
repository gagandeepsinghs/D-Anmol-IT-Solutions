import aiImage from '../assets/images/courses/artificial-intelligence.jpg'
import classroomImage from '../assets/images/modules/classroom-learning.jpg'
import computerImage from '../assets/images/courses/computer-basics.jpg'
import analyticsImage from '../assets/images/courses/data-analytics.jpg'
import marketingImage from '../assets/images/courses/digital-marketing.jpg'
import marketingWorkImage from '../assets/images/courses/digital-marketing-work.jpg'
import homeLearningImage from '../assets/images/modules/home-team-learning.jpg'
import pythonImage from '../assets/images/courses/python-programming.jpg'
import teamPlanningImage from '../assets/images/modules/team-planning.jpg'
import teamProjectImage from '../assets/images/modules/team-project.jpg'
import hardwareImage from '../assets/images/courses/technology-hardware.jpg'
import workshopImage from '../assets/images/modules/technology-workshop.jpg'
import typingImage from '../assets/images/courses/typing-practice.jpg'

const courseModuleImageOverrides = import.meta.glob(
  '../assets/images/modules/course-modules/*/*.{jpg,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' },
)
const moduleImageExtensions = ['jpg', 'jpeg', 'png', 'webp']

const moduleImagesByCourse = {
  AI_Automation: [workshopImage, aiImage, hardwareImage, analyticsImage, teamProjectImage, classroomImage],
  Artificial_Intelligence_Machine_Learning: [aiImage, pythonImage, analyticsImage, hardwareImage, classroomImage, teamProjectImage],
  Computer_Basics_MS_Office: [computerImage, hardwareImage, classroomImage, homeLearningImage, teamProjectImage, typingImage],
  Computer_Typing: [typingImage, computerImage, classroomImage, homeLearningImage, teamProjectImage, hardwareImage],
  Corporate_Training: [teamPlanningImage, workshopImage, teamProjectImage, classroomImage, homeLearningImage, analyticsImage],
  Data_Analytics_Foundations: [analyticsImage, pythonImage, hardwareImage, classroomImage, teamProjectImage, aiImage],
  Desktop_to_Dashboard_Excel_Power_BI_SQL: [analyticsImage, computerImage, hardwareImage, pythonImage, classroomImage, teamProjectImage],
  Digital_Marketing: [marketingWorkImage, marketingImage, teamPlanningImage, classroomImage, teamProjectImage, analyticsImage],
  Full_Stack_Web_Development: [hardwareImage, pythonImage, computerImage, classroomImage, teamProjectImage, aiImage],
  Generative_AI: [aiImage, pythonImage, workshopImage, analyticsImage, classroomImage, teamProjectImage],
  Python_Programming: [pythonImage, computerImage, hardwareImage, classroomImage, teamProjectImage, analyticsImage],
}

export function getCourseModuleImage(folder, index) {
  const images = moduleImagesByCourse[folder] || moduleImagesByCourse.Artificial_Intelligence_Machine_Learning
  const moduleNumber = String(index + 1).padStart(2, '0')
  const customImage = moduleImageExtensions
    .map((extension) => courseModuleImageOverrides[`../assets/images/modules/course-modules/${folder}/module-${moduleNumber}.${extension}`])
    .find(Boolean)

  if (customImage) return customImage
  return images[index % images.length]
}
