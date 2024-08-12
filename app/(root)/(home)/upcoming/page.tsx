import React from 'react'
import CallList from '@/components/CallList'
const Upcomming = () => {
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
    <h1 className='text-3xl font-bold'>
      Upcomings
    </h1>
    <CallList type='upcoming'/>
  </section>
  )
}

export default Upcomming
