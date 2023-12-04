import React from 'react';
import { render, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, AuthContext } from './authContext.js';

describe('authContext', () => {
    it('should provide initial isAuthenticated state as false', () => {
        sessionStorage.removeItem('user');

        render(
            <AuthProvider>
                <AuthContext.Consumer>
                    {({ isAuthenticated }) => {
                        expect(isAuthenticated).toBe(false);
                    }}
                </AuthContext.Consumer>
            </AuthProvider>
        );
    });

    it('should update isAuthenticated state when setIsAuthenticated is called', async () => {
        let triggerUpdate;
        function TestComponent() {
            const { isAuthenticated, setIsAuthenticated } = React.useContext(AuthContext);
            triggerUpdate = setIsAuthenticated;
            return <div>{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>;
        }
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        await act(async () => {
            triggerUpdate(true);
            await new Promise(resolve => setTimeout(resolve, 0)); // Wait for state to update
        });
        expect(screen.getByText('Authenticated')).toBeInTheDocument();
        await act(async () => {
            triggerUpdate(false);
            await new Promise(resolve => setTimeout(resolve, 0)); // Wait for state to update
        });
        expect(screen.getByText('Not Authenticated')).toBeInTheDocument();
    });
});
