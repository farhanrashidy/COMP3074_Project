import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

const RegisterModal = ({ visible, onClose }) => {
    const { signUp } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill out all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        const { error: signUpError, data } = await signUp(email, password, name);

        setLoading(false);

        if (signUpError) {
            setError(signUpError.message);
        } else {
            setSuccess(data.message);
            // Clear form after a delay
            setTimeout(() => {
                onClose();
                setSuccess(null);
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            }, 2000);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Create an account</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    {loading && <ActivityIndicator style={{ marginBottom: 10 }} />}
                    {error && <Text style={styles.errorTextModal}>{error}</Text>}
                    {success && <Text style={styles.successText}>{success}</Text>}

                    <View style={styles.buttonRow}>
                        <Button title="Cancel" onPress={onClose} color="#666" />
                        <Button title="Register" onPress={handleSignUp} disabled={loading} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};


export default function SignInPage() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const submit = async () => {
        const { loginError } = await signIn(email, password);
        if (loginError) {
            setError(loginError.message);
        } else {
            setError(null);
        }
    };

    return (
        <View style={styles.container}>
            <RegisterModal visible={modalVisible} onClose={() => setModalVisible(false)} />

            <Text style={styles.title}>Welcome!</Text>

            <TextInput
                style={styles.input}
                placeholder="example@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.buttonContainer}>
                <Button title="Sign In" onPress={submit} />
            </View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.registerText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    buttonContainer: {
        marginBottom: 15,
    },
    registerText: {
        color: '#007AFF',
        textAlign: 'center',
        fontWeight: '600',
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // Removed background color to remove the dark overlay
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Shadow for Android
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    errorTextModal: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
    successText: {
        color: 'green',
        textAlign: 'center',
        marginTop: 10,
    },
});
