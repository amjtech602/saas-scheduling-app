'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

// interface User {
//   id: string
//   name: string
//   email: string,
//   businessName:string,
//   avatar?: string
// }
interface Credential {
    email: string,
    password: string
}

interface User {
    id: Number,
    email: string
    firstName: string,
    lastName: string,
    timeZone: string
    role: string,
    subscriptionId: number,
    picture: string
    authProvider: string
    providerId: number
    businessName: string,
    avatar?: string
}

interface UserContextType {
    user: User | null
    loading: boolean
    initiateSocialLogin: (provider: string, redirectPath?: string) => Promise<void>
    logout: Function
    login: Function
}

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
    initiateSocialLogin: async (_provider: string, _redirectPath?: string) => { },
    logout: Function,
    login: Function
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

                console.log("userrrrrrrrrr ", response.data);

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

    const login = async (credentials: Credential) => {
        const response = await axios.post('https://anotadoai.com.br/agendei-api/v1/auth/local-login', {
            email: credentials?.email,
            password: credentials?.password
        }, {
            withCredentials: true
        });
        setUser(response.data);
    }


    const initiateSocialLogin = async (provider: string, redirectPath = '/') => {
        const baseUrl = window.location.origin; // exemplo: http://localhost:3000 ou https://flexybot.com.br
        const fullRedirect = `${baseUrl}${redirectPath}`;
        const encodedRedirect = encodeURIComponent(fullRedirect);
        window.location.href = `https://anotadoai.com.br/agendei-api/v1/auth/${provider}-login?redirect_uri=${encodedRedirect}`;

    };

    const logout = async () => {
        try {
            await axios.post('https://anotadoai.com.br/agendei-api/v1/auth/logout', {}, {
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
        <UserContext.Provider value={{ user, loading, login, logout, initiateSocialLogin }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
