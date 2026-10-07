'use client';

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { fetchSectorChurches, type SectorChurchOption } from "@/services/sector-login"

type Mode = 'user' | 'church';

const errorMessage = (err: unknown): string =>
  err instanceof Error && err.message
    ? err.message
    : "Error al iniciar sesión. Por favor intenta de nuevo.";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [mode, setMode] = useState<Mode>('user');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [churches, setChurches] = useState<SectorChurchOption[]>([]);
  const [churchesError, setChurchesError] = useState("");
  const [churchId, setChurchId] = useState("");
  const [churchPassword, setChurchPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInSector } = useAuth();

  // La lista de iglesias se pide recién cuando se abre la pestaña.
  useEffect(() => {
    if (mode !== 'church' || churches.length > 0) return;

    let cancelled = false;
    fetchSectorChurches()
      .then((list) => {
        if (cancelled) return;
        setChurches(list);
        setChurchesError(list.length === 0 ? "No hay iglesias disponibles." : "");
      })
      .catch((err: unknown) => {
        if (!cancelled) setChurchesError(errorMessage(err));
      });

    return () => {
      cancelled = true;
    };
  }, [mode, churches.length]);

  const handleUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(username, password);
      // La redirección se maneja en el contexto
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  };

  const handleChurchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!churchId) {
      setError("Selecciona tu iglesia.");
      return;
    }

    setLoading(true);
    try {
      await signInSector(Number(churchId), churchPassword);
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <Card className="p-0">
        <CardContent className="grid gap-6 p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Bienvenido</h1>
            <p className="text-muted-foreground text-balance">
              Inicia sesión en tu cuenta IMPCH Zañartu
            </p>
          </div>
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <Tabs
            value={mode}
            onValueChange={(value) => {
              setMode(value as Mode);
              setError("");
            }}
          >
            <TabsList className="w-full">
              <TabsTrigger value="user" disabled={loading}>Usuario</TabsTrigger>
              <TabsTrigger value="church" disabled={loading}>Iglesia</TabsTrigger>
            </TabsList>

            <TabsContent value="user">
              <form onSubmit={handleUserSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="username">Usuario</FieldLabel>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Ingresa tu usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </Field>
                  <Field>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </TabsContent>

            <TabsContent value="church">
              <form onSubmit={handleChurchSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="church">Iglesia</FieldLabel>
                    <Select value={churchId} onValueChange={setChurchId} disabled={loading || churches.length === 0}>
                      <SelectTrigger id="church" className="w-full">
                        <SelectValue placeholder="Selecciona tu iglesia" />
                      </SelectTrigger>
                      <SelectContent>
                        {churches.map((church) => (
                          <SelectItem key={church.id} value={String(church.id)}>
                            {church.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {churchesError && (
                      <p className="text-sm text-destructive">{churchesError}</p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="church-password">Clave</FieldLabel>
                    <Input
                      id="church-password"
                      type="password"
                      value={churchPassword}
                      onChange={(e) => setChurchPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <FieldDescription>
                      Si olvidaste la clave, pídela a la administración de Zañartu.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <FieldDescription className="text-center text-sm">
        Al hacer clic en continuar, aceptas nuestros <a href="#" className="underline hover:no-underline">Términos de Servicio</a>{" "}
        y <a href="#" className="underline hover:no-underline">Política de Privacidad</a>.
      </FieldDescription>
    </div>
  )
}
