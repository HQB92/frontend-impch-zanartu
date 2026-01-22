/**
 * Ejemplo de uso de GraphQL en el proyecto
 * 
 * Este archivo muestra cómo usar las queries y mutations de GraphQL
 * en componentes de React con TypeScript
 */

import { useQuery, useMutation } from '@apollo/client/react';
import { GET_PROFILE, GET_ALL_MEMBERS } from './query';
import { CREATE_MEMBER, UPDATE_MEMBER } from './mutation';

// Ejemplo de uso de una query en un componente
export function useProfileExample(rut: string) {
  const { data, loading, error } = useQuery(GET_PROFILE, {
    variables: { rut },
    skip: !rut, // No ejecutar si no hay rut
  });

  return {
    profile: (data as any)?.Member?.getByRut,
    loading,
    error,
  };
}

// Ejemplo de uso de una mutation en un componente
export function useCreateMemberExample() {
  const [createMember, { loading, error }] = useMutation(CREATE_MEMBER, {
    // Opcional: actualizar el cache después de la mutación
    refetchQueries: [{ query: GET_ALL_MEMBERS }],
  });

  const handleCreateMember = async (memberData: any) => {
    try {
      const result = await createMember({
        variables: { member: memberData },
      });
      return (result.data as any)?.Member?.create;
    } catch (err) {
      console.error('Error creating member:', err);
      throw err;
    }
  };

  return {
    createMember: handleCreateMember,
    loading,
    error,
  };
}
