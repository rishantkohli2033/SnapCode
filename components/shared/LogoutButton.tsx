"use client";
import React from 'react'
import { Button } from '../ui/button'
import { LogOut } from 'lucide-react'
import { logout } from '@/lib/actions'
import { useFormState, useFormStatus } from 'react-dom'

const logoutButton = () => {
  const {pending} = useFormStatus();
  const [errorMessage, dispatch] = useFormState(logout,null);
  return (
        <form action={dispatch}>
            <Button className='bg-black text-white rounded-full p-3 text-xs md:text-sm' disabled={pending} aria-disabled={pending}>
                <LogOut className='cursor-pointer' />
            </Button>
        </form>
  )
}

export default logoutButton