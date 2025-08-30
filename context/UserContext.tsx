'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios';

// interface User {
//   id: string
//   name: string
//   email: string,
//   businessName:string,
//   avatar?: string
// }
interface User {
    id:Number,
    email:string
    firstName:string,
    lastName:string,
    timeZone:string
    role:string,
    subscriptionId:number,
    picture:string
    authProvider:string
    providerId:number
    businessName:string,
    avatar?: string
}

interface UserContextType {
  user: User | null
  loading: boolean
//   loginWithGoogle: () => Promise<void>
   logout: () => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
//   loginWithGoogle: async () => {},
   logout: () => {},
})

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Quando o app carrega, tenta pegar o user se já tiver cookie setado
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await axios.get(
          'https://anotadoai.com.br/agendei-api/v1/auth/atributtes',
          {
            withCredentials: true,
          }
        )

        console.log("userrrrrrrrrr ",response.data);

        setUser(response.data)
      } catch (err) {
        console.error('Erro ao buscar usuário:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

//   const loginWithGoogle = async () => {
//     try {
//       const res = await fetch('/api/auth/google', {
//         method: 'GET',
//         credentials: 'include',
//       })

//       if (!res.ok) {
//         throw new Error('Erro ao iniciar login')
//       }

//       // Aqui você provavelmente vai ser redirecionado, ou já está autenticado
//       // Opcional: pode forçar reload ou re-fetch do user
//       const userRes = await fetch('/api/me', {
//         credentials: 'include',
//       })

//       if (!userRes.ok) throw new Error('Erro ao carregar usuário')

//       const data = await userRes.json()
//       setUser(data.user)
//     } catch (error) {
//       console.error('Login com Google falhou:', error)
//       setUser(null)
//     }
//   }

const logout = async () => {
    try {
      await axios.post('https://anotadoai.com.br/agendei-api/v1/auth/logout', {}, {  // falta implementar este endpoint
        withCredentials: true,
      })
    } catch (error) {
      console.warn('Erro ao deslogar:', error)
    } finally {
      setUser(null)
      router.push('/')
    }
  }

  return (
    <UserContext.Provider value={{ user, loading,logout}}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
