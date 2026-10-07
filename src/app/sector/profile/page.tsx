'use client';

import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CHANGE_SECTOR_PASSWORD,
  GET_SECTOR_PROFILE,
  UPDATE_SECTOR_PROFILE,
  type SectorChurchInfo,
  type ServiceResult,
  typedDoc,
} from "@/services/sector-graphql"

const MIN_PASSWORD_LENGTH = 8;

interface ProfileData {
  SectorChurch: { me: SectorChurchInfo | null } | null;
}

interface UpdateProfileData {
  SectorChurch: { updateProfile: ServiceResult | null } | null;
}

interface ChangePasswordData {
  SectorChurch: { changePassword: ServiceResult | null } | null;
}

const messageOf = (err: unknown, fallback: string): string =>
  err instanceof Error && err.message ? err.message : fallback;

export default function SectorProfilePage() {
  const [getProfile, { data, loading, error }] = useLazyQuery(typedDoc<ProfileData>(GET_SECTOR_PROFILE), {
    fetchPolicy: 'no-cache',
  });
  const [updateProfile, { loading: savingProfile }] = useMutation(typedDoc<UpdateProfileData>(UPDATE_SECTOR_PROFILE));
  const [changePassword, { loading: savingPassword }] = useMutation(typedDoc<ChangePasswordData>(CHANGE_SECTOR_PASSWORD));

  const [profile, setProfile] = useState({ pastor: '', address: '', phone: '' });
  const [profileError, setProfileError] = useState('');
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    let active = true;
    getProfile()
      .then((result) => {
        const loaded = result.data?.SectorChurch?.me;
        if (active && loaded) {
          setProfile({
            pastor: loaded.pastor ?? '',
            address: loaded.address ?? '',
            phone: loaded.phone ?? '',
          });
        }
      })
      // El error queda en `error` del hook y se muestra más abajo.
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [getProfile]);

  const church = data?.SectorChurch?.me ?? null;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    try {
      const response = await updateProfile({ variables: profile });
      const result = response.data?.SectorChurch?.updateProfile;
      if (result?.code === 200) {
        toast.success(result.message || 'Perfil actualizado exitosamente');
      } else {
        setProfileError(result?.message || 'No se pudo actualizar el perfil');
      }
    } catch (err) {
      setProfileError(messageOf(err, 'No se pudo actualizar el perfil'));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (passwords.next.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`La nueva clave debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordError('La nueva clave y su confirmación no coinciden.');
      return;
    }

    try {
      const response = await changePassword({
        variables: { currentPassword: passwords.current, newPassword: passwords.next },
      });
      const result = response.data?.SectorChurch?.changePassword;
      if (result?.code === 200) {
        toast.success(result.message || 'Clave cambiada exitosamente');
        setPasswords({ current: '', next: '', confirm: '' });
      } else {
        setPasswordError(result?.message || 'No se pudo cambiar la clave');
      }
    } catch (err) {
      setPasswordError(messageOf(err, 'No se pudo cambiar la clave'));
    }
  };

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mi Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-destructive">Error al cargar el perfil: {error.message}</p>
            ) : loading || !church ? (
              <p className="text-muted-foreground">Cargando...</p>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Iglesia</p>
                  <p className="text-lg">{church.name}</p>
                </div>
                {profileError && (
                  <Alert variant="destructive">
                    <AlertDescription>{profileError}</AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pastor">Pastor</Label>
                    <Input
                      id="pastor"
                      value={profile.pastor}
                      maxLength={255}
                      onChange={(e) => setProfile((prev) => ({ ...prev, pastor: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      maxLength={255}
                      onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      maxLength={255}
                      onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cambiar clave</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {passwordError && (
                <Alert variant="destructive">
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Clave actual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    autoComplete="current-password"
                    value={passwords.current}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva clave</Label>
                  <Input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    value={passwords.next}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, next: e.target.value }))}
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                  />
                  <p className="text-xs text-muted-foreground">Mínimo {MIN_PASSWORD_LENGTH} caracteres.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Repetir nueva clave</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={savingPassword}>
                {savingPassword ? 'Cambiando...' : 'Cambiar clave'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
