"use client"

import { BookingFlow } from "@/components/booking/booking-flow"

interface BookingPageProps {
  params: {
    professionalId: string
  }
}


export default function BookingPage({ params }: BookingPageProps) {
  return <BookingFlow professionalId={params.professionalId} />
}
