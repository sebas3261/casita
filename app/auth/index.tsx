import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../../context/authContext/authContext'; // Asegúrate de que la ruta sea correcta

const AuthView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Estado para determinar si es Login o Register
  const { login, signUp } = useContext(AuthContext); // Obtener login y signUp desde el context

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.push('/'); // Redirigir a la pantalla principal después del login
    } catch (error) {
      console.log('Error en el login:', error);
    }
  };

  const handleRegister = async () => {
    try {
      await signUp(email, password, { name });
      router.push('./main/home'); // Redirigir a LoginView después de un registro exitoso
    } catch (error) {
      console.log('Error en el registro:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>

      {/* Solo mostrar el campo de "Full Name" si está en la vista de registro */}
      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={isLogin ? handleLogin : handleRegister}
      >
        <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.text}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </Text>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.link}>{isLogin ? 'Register here' : 'Login here'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#3b71f3',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  text: {
    fontSize: 14,
    color: '#888',
  },
  link: {
    fontSize: 14,
    color: '#3b71f3',
    marginLeft: 5,
  },
});

export default AuthView;
