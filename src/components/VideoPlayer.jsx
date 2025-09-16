import React from 'react'

export default function VideoPlayer({ video }) {
  if (!video) return <div className='p-4 text-gray-500'>Select a video to play</div>
  const isYouTube = video.url && (video.url.includes('youtube.com') || video.url.includes('youtu.be'))
  return (
    <div className='space-y-2'>
      <div className='bg-black rounded overflow-hidden'>
        {isYouTube ? (
          <div className='relative' style={{paddingTop: '56.25%'}}>
            <iframe title={video.title} src={convertYoutubeEmbed(video.url)} className='absolute inset-0 w-full h-full' frameBorder='0' allowFullScreen></iframe>
          </div>
        ) : (
          <video controls className='w-full' src={video.url} />
        )}
      </div>
      <div>
        <h3 className='text-lg font-semibold'>{video.title}</h3>
        {video.durationSeconds && <div className='text-sm text-gray-500'>{video.durationSeconds}s</div>}
      </div>
    </div>
  )
}

function convertYoutubeEmbed(url){
  try{
    if(url.includes('youtu.be')){
      const id = url.split('/').pop()
      return `https://www.youtube.com/embed/${id}`
    }
    const u = new URL(url)
    const v = u.searchParams.get('v')
    if(v) return `https://www.youtube.com/embed/${v}`
  }catch(e){ }
  return url
}
