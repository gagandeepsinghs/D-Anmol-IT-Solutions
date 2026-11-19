import footerLogo from '../assets/images/brand/optimized/D Anmol Enterprises Logo Light.webp'
import headerLogo from '../assets/images/brand/optimized/D Anmol Enterprises Logo.webp'
import aiImage from '../assets/images/courses/covers/optimized/artificial-intelligence.webp'
import classroomImage from '../assets/images/sections/optimized/classroom-learning.webp'
import homeTeamImage from '../assets/images/sections/optimized/home-team-learning.webp'
import teamPlanningImage from '../assets/images/sections/optimized/team-planning.webp'
import technologyWorkshopImage from '../assets/images/sections/technology-workshop.jpg'

export const sitePhotoFields = [
  { key: 'compactLogo', title: 'Header logo', defaultImage: headerLogo },
  { key: 'logo', title: 'Footer logo', defaultImage: footerLogo },
  { key: 'homeHeroImage', title: 'Home page - main photo', defaultImage: homeTeamImage },
  { key: 'homeAboutImage', title: 'Home page - about photo', defaultImage: classroomImage },
  { key: 'aboutHeroImage', title: 'About page - main photo', defaultImage: teamPlanningImage },
  { key: 'aboutStoryImage', title: 'About page - story photo', defaultImage: classroomImage },
  { key: 'aiPythonHeroImage', title: 'AI & data page - main photo', defaultImage: aiImage },
  { key: 'aiPythonApproachImage', title: 'AI & data page - approach photo', defaultImage: technologyWorkshopImage },
  { key: 'corporateHeroImage', title: 'Corporate page - main photo', defaultImage: technologyWorkshopImage },
  { key: 'corporateRoadmapImage', title: 'Corporate page - roadmap photo', defaultImage: teamPlanningImage },
  { key: 'corporateFormatImage', title: 'Corporate page - format photo', defaultImage: teamPlanningImage },
]

export const sitePhotoDefaults = Object.fromEntries(
  sitePhotoFields.map(({ key, defaultImage }) => [key, defaultImage]),
)
