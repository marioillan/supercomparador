import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const obtenerSesion = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      if (userId) {
        const { data } = await supabase
          .from('usuarios')
          .select('usuario')
          .eq('id', userId)
          .single();
        if (data) {
          setUsuario({ id: userId, nombreUsuario: data.usuario });
        }
      }

      setIsLoading(false);
    };

    obtenerSesion();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from('usuarios')
          .select('usuario')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setUsuario({ id: session.user.id, nombreUsuario: data.usuario });
            }
          });
      } else {
        setUsuario(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
