const {
    togglePasswordVisibility,
    validateEmail,
    validatePassw,
    validateRole,
    handleFormSubmit,
} = require('./login_signup.js');

const setPasswErrorMock = jest.fn();
global.alert = jest.fn();
global.console.log = jest.fn();

// describe('handleFormSubmit', () => {
//     let mockEvent;

//     beforeEach(() => {
//         jest.clearAllMocks();
//         // Mocking the preventDefault function
//         mockEvent = { preventDefault: jest.fn() };
//     });
//     const validateEmail = jest.fn();
//     const validatePassw = jest.fn();
//     const validateRole = jest.fn();

//     it('should log "Submitted" if all validations pass', () => {
//         // Mocking validation functions to return true
//         validateEmail.mockReturnValue(true);
//         validatePassw.mockReturnValue(true);
//         validateRole.mockReturnValue(true);
//         // handleFormSubmit(mockEvent, email, name, passw, role);


//         // Mock data
//         const email = 'test@example.com';
//         const name = 'John Doe';
//         const passw = 'Valid@Password123';
//         const role = 'Receiver';

//         // Run the function
//         handleFormSubmit(mockEvent, email, name, passw, role);

//         // Assertions
//         expect(global.console.log).toHaveBeenCalledWith('Submitted:', email, name, passw, role);
//         expect(mockEvent.preventDefault).toHaveBeenCalled();
//         expect(validateEmail).toHaveBeenCalledWith(email);
//         expect(validatePassw).toHaveBeenCalledWith(passw);
//         expect(validateRole).toHaveBeenCalledWith(role);
//     });
// });

describe('validateRole', () => {
    it('should return false for an empty role', () => {
        // Arrange
        const role = "";
        // Act
        const result = validateRole(role);
        // Assert
        expect(result).toBe(false);
    });

    it('should return true for a non-empty role', () => {
        // Arrange
        const role = "Sender"; // Replace with a non-empty role value
        // Act
        const result = validateRole(role);
        // Assert
        expect(result).toBe(true);
    });

    it('should return true for a non-empty role', () => {
        // Arrange
        const role = "Receiver"; // Replace with a non-empty role value
        // Act
        const result = validateRole(role);
        // Assert
        expect(result).toBe(true);
    });
});

describe('validatePassw', () => {
    it('should set passwError to false for a valid password', () => {
        const validPassword = 'Valid@Password123';
        validatePassw(validPassword, setPasswErrorMock);
        expect(setPasswErrorMock).toHaveBeenCalledWith(false);
    });

    it('should set passwError to true for an invalid password with insufficient length', () => {
        const invalidPassword = 'Short1';
        validatePassw(invalidPassword, setPasswErrorMock);
        expect(setPasswErrorMock).toHaveBeenCalledWith(true);
    });

    it('should set passwError to true for an invalid password without a digit', () => {
        const invalidPassword = 'NoDigitPassword';
        validatePassw(invalidPassword, setPasswErrorMock);
        expect(setPasswErrorMock).toHaveBeenCalledWith(true);
    });

    it('should set passwError to true for an invalid password without a letter', () => {
        const invalidPassword = '1234567890';
        validatePassw(invalidPassword, setPasswErrorMock);
        expect(setPasswErrorMock).toHaveBeenCalledWith(true);
    });

    it('should set passwError to true for an invalid password without a symbol', () => {
        const invalidPassword = 'NoSymbol123';
        validatePassw(invalidPassword, setPasswErrorMock);
        expect(setPasswErrorMock).toHaveBeenCalledWith(true);
    });
});

describe('validateEmail', () => {
    let emailInput, emailTooltip;

    beforeEach(() => {
        // 创建可变的style对象
        const style = { visibility: 'hidden' };

        // 设置emailInput和emailTooltip对象
        emailInput = { value: '' };
        emailTooltip = { style };

        // 使用jest.fn()创建模拟函数
        document.getElementById = jest.fn((id) => {
            const elements = {
                'emailInput': emailInput,
                'emailTooltip': emailTooltip,
            };

            if (!(id in elements)) {
                console.error(`No mock implementation for element with id: ${id}`);
                throw new Error(`No mock implementation for element with id: ${id}`);
            }

            return elements[id];
        });
    });

    test('should validate a correct email address', () => {
        emailInput.value = 'test@example.com';
        const result = validateEmail();
        expect(result).toBe(true);
        expect(emailTooltip.style.visibility).toBe('hidden');
    });

    test('should invalidate an incorrect email address', () => {
        emailInput.value = 'test@';
        const result = validateEmail();
        expect(result).toBe(false);
        expect(emailTooltip.style.visibility).toBe('visible');
    });
});

describe('togglePasswordVisibility', () => {
    let passwordInput, passwordToggle;

    beforeEach(() => {
        // 设置passwordInput对象
        passwordInput = { type: 'password' };
        // 创建一个模拟的.password-toggle元素
        passwordToggle = { textContent: '' };

        // 使用jest.fn()创建模拟函数
        document.getElementById = jest.fn((id) => {
            if (id === 'passwordInput') {
                return passwordInput;
            }
            return null;
        });
        // 使用jest.fn()模拟document.querySelector函数
        document.querySelector = jest.fn((selector) => {
            if (selector === '.password-toggle') {
                return passwordToggle;
            }
            return null;
        });
    });

    test('should show the password when the password is hidden', () => {
        togglePasswordVisibility();
        expect(passwordInput.type).toBe('text');
        expect(passwordToggle.textContent).toBe('Hide');
    });

    test('should hide the password when the password is shown', () => {
        passwordInput.type = 'text';
        togglePasswordVisibility();
        expect(passwordInput.type).toBe('password');
        expect(passwordToggle.textContent).toBe('Show');
    });
});
