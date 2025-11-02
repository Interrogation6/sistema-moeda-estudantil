import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { LoginProvider } from './LoginProvider';

const queryClient = new QueryClient();

export function RootProvider({ children }: Readonly<{ children: React.ReactNode}>) {
    return (
        <QueryClientProvider client={queryClient}>
            <LoginProvider>
                {children}
            </LoginProvider>
        </QueryClientProvider>
    )
}