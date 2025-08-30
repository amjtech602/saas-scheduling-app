
import { BookingFlow } from "@/components/booking/booking-flow";

interface BookingPageProps {
  params: Promise<{ professionalId: string }>
}


export default async function BookingPage({ params }: BookingPageProps) {
  const { professionalId } = await params;
  return <BookingFlow professionalId={professionalId} />
}
