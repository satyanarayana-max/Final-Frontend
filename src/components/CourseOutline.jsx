import React from 'react'

export default function CourseOutline({ outline, onSelectVideo }) {
  const [openLesson, setOpenLesson] = React.useState(null)
  if (!outline) return <div>Loading outline...</div>
  return (
    <div className='space-y-2'>
      {outline.lessons && outline.lessons.length===0 && <div className='text-sm text-gray-500'>No lessons yet.</div>}
      {outline.lessons && outline.lessons.map(lesson => (
        <div key={lesson.id} className='border rounded'>
          <button className='w-full text-left px-4 py-2 bg-gray-100 flex justify-between items-center' onClick={() => setOpenLesson(openLesson===lesson.id?null:lesson.id)}>
            <div className='font-semibold'>{lesson.title}</div>
            <div className='text-sm text-gray-600'>{lesson.videos?lesson.videos.length:0} videos</div>
          </button>
          {openLesson===lesson.id && (
            <div className='p-2 bg-white'>
              {lesson.videos && lesson.videos.map(video => (
                <div key={video.id} className='p-2 hover:bg-gray-50 cursor-pointer flex justify-between' onClick={() => onSelectVideo(video)}>
                  <div className='flex items-center gap-2'>
                    <span>🎬</span>
                    <div>
                      <div className='text-sm'>{video.title}</div>
                      <div className='text-xs text-gray-500'>{video.durationSeconds?video.durationSeconds+"s":""} {video.preview?"• Preview":""}</div>
                    </div>
                  </div>
                  <div className='text-xs text-gray-500'>{video.orderIndex?"#"+video.orderIndex:""}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
