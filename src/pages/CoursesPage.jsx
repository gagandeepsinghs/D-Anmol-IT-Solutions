import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import CourseCard from '../components/CourseCard'
import { Button } from '../components/Button'
import { useAppData } from '../context/AppDataContext'

export default function CoursesPage() {
  const { courses } = useAppData()
  const categories = [...new Set(courses.map((course) => course.category).filter(Boolean))]
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const category = searchParams.get('category') || 'All categories'
  const visibleCourses = useMemo(() => courses.filter((course) => {
    if (course.published === false) return false
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || `${course.title} ${course.description} ${course.category}`.toLowerCase().includes(query)
    return matchesSearch && (category === 'All categories' || course.category === category)
  }), [courses, search, category])

  const setCategory = (value) => {
    const next = new URLSearchParams(searchParams)
    if (value === 'All categories') next.delete('category')
    else next.set('category', value)
    setSearchParams(next)
  }

  return (
    <>
      <section className="page-hero courses-hero"><div className="page-wrap page-hero-inner"><span className="eyebrow eyebrow-light">Find your learning path</span><h1>Skills for the work<br />you want to do.</h1><p>Explore AI, Full Stack Development, data, digital marketing, computer and shorthand courses. Online training is available across India; offline training targets Mohali, Chandigarh, and Panchkula. Ask us to confirm availability for your chosen course.</p><div className="courses-search"><Search size={19} /><input aria-label="Search courses" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses or skills..." /><span>{visibleCourses.length} {visibleCourses.length === 1 ? 'course' : 'courses'}</span></div></div><span className="page-hero-orb" aria-hidden="true"><Sparkles size={110} /></span></section>
      <section className="section section-white course-listing-section"><div className="page-wrap">
        <div className="filter-row"><div className="filter-label"><SlidersHorizontal size={17} /> Filter by topic</div><div className="category-filters"><button type="button" className={`filter-chip ${category === 'All categories' ? 'selected' : ''}`} onClick={() => setCategory('All categories')}>All topics</button>{categories.map((item) => <button type="button" key={item} className={`filter-chip ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
        {visibleCourses.length > 0 ? <div className="course-grid">{visibleCourses.map((course) => <CourseCard key={course.id} course={course} showTopics />)}</div> : <div className="empty-state empty-courses"><span className="empty-icon"><Search size={23} /></span><h2>No courses found</h2><p>Try another search or choose a different topic.</p><Button type="button" variant="outline" onClick={() => { setSearch(''); setCategory('All categories') }}>Clear filters</Button></div>}
      </div></section>
    </>
  )
}
