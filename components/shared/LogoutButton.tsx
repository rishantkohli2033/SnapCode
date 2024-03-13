import React from 'react'
import { Button } from '../ui/button'
import { LogOut } from 'lucide-react'
import { logout } from '@/lib/actions'

const logoutButton = () => {
  
  return (
        <form action={logout}>
            <Button className='bg-black text-white rounded-full p-3 text-xs md:text-sm'>
                <LogOut className='cursor-pointer' />
            </Button>
        </form>
  )
}

export default logoutButton