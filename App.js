import React, { useState } from 'react';
import {
	 StyleSheet,
	 Text,
	 View,
	 TextInput,
	 Pressable,
	 FlatList,
	 Alert,
	 KeyboardAvoidingView,
	 Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
	 const [currentScreen, setCurrentScreen] = useState('dashboard');

	 // Pre-populated with the exact items from the wireframe
	 const [menuItems, setMenuItems] = useState([
			{ id: '1', dishName: 'Garlic Bread',
				description: 'Freshly baked with garlic butter',
			  course: 'Starter', price: '45' },
			{ id: '2', dishName: 'Rump Steak',
				description: '300g prime beef with peppercorn sauce',
				course: 'Main', price: '185' },
			{ id: '3', dishName: 'Ice Cream', description: 'Vanilla bean ice cream',
				course: 'Dessert', price: '45' },
	 ]);

	 const [dishName, setDishName] = useState('');
	 const [description, setDescription] = useState('');
	 const [course, setCourse] = useState('Starter');
	 const [price, setPrice] = useState('');
	 const [errorMessage, setErrorMessage] = useState('');

	 const handleSaveItem = () => {
			if (!dishName || !description || !course || !price) {
				 setErrorMessage('Please fill out all fields to save this dish.');
				 return;
			}

			const newItem = {
				 id: Math.random().toString(),
				 dishName,
				 description,
				 course,
				 price
			};

			setMenuItems([...menuItems, newItem]);

			// Reset fields
			setDishName('');
			setDescription('');
			setCourse('Starter');
			setPrice('');
			setErrorMessage('');

			// Success prompt requirement and auto-redirect
			Alert.alert('Success', 'Dish added to the menu successfully!');
			setCurrentScreen('dashboard');
	 };

	 const renderDashboard = () => (
			<View style={styles.screen}>
				 <View style={styles.header}>
						<Text style={styles.appTitle}>Christoffel's</Text>
						<Text style={styles.screenSubtitle}>Menu Dashboard</Text>
				 </View>

				 <FlatList
						data={menuItems}
						keyExtractor={(item) => item.id}
						contentContainerStyle={styles.listContainer}
						ListEmptyComponent={
							 <Text style={styles.emptyMessage}>No dishes available. Add a new dish below.</Text>
						}
						renderItem={({ item }) => (
							 <View style={styles.menuItemCard}>
									<View style={styles.cardHeader}>
										 <Text style={styles.dishNameText}>{item.dishName}</Text>
										 <Text style={styles.priceText}>R{item.price}</Text>
									</View>
									<Text style={styles.courseTag}>{item.course}</Text>
									<Text style={styles.descriptionText}>{item.description}</Text>
							 </View>
						)}
				 />

				 <Pressable
						style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
						onPress={() => setCurrentScreen('addForm')}
				 >
						<Text style={styles.primaryButtonText}>+ Add New Dish</Text>
				 </Pressable>
			</View>
	 );

	 const renderAddForm = () => (
			<KeyboardAvoidingView
				 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				 style={styles.screen}
			>
				 <View style={styles.header}>
						<Text style={styles.appTitle}>Add New Dish</Text>
				 </View>

				 {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

				 <FlatList
						data={[{ key: 'form' }]} // Dummy data to allow scrolling if keyboard covers form
						renderItem={() => (
							 <View style={styles.formContainer}>
									<Text style={styles.label}>Dish Name</Text>
									<TextInput
										 style={styles.input}
										 placeholder="e.g. Garlic Bread"
										 placeholderTextColor="rgba(255, 255, 255, 0.6)"
										 value={dishName}
										 onChangeText={setDishName}
									/>

									<Text style={styles.label}>Description</Text>
									<TextInput
										 style={[styles.input, styles.multilineInput]}
										 placeholder="Enter details..."
										 placeholderTextColor="rgba(255, 255, 255, 0.6)"
										 value={description}
										 onChangeText={setDescription}
										 multiline
										 numberOfLines={3}
									/>

									<Text style={styles.label}>Course (Starter/Main/Dessert)</Text>
									<View style={styles.pickerContainer}>
										 <Picker
												selectedValue={course}
												onValueChange={(itemValue) => setCourse(itemValue)}
												style={styles.picker}
										 >
												<Picker.Item label="Starter" value="Starter" />
												<Picker.Item label="Main" value="Main" />
												<Picker.Item label="Dessert" value="Dessert" />
										 </Picker>
									</View>

									<Text style={styles.label}>Price</Text>
									<TextInput
										 style={styles.input}
										 placeholder="e.g. 45"
										 placeholderTextColor="rgba(255, 255, 255, 0.6)"
										 value={price}
										 onChangeText={setPrice}
										 keyboardType="numeric"
									/>

									<Pressable
									style={({ pressed }) => [styles.primaryButton, { marginTop: 30 }, pressed && styles.buttonPressed]}
										 onPress={handleSaveItem}
									>
										 <Text style={styles.primaryButtonText}>Save Menu Item</Text>
									</Pressable>

									<Pressable
										 style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
										 onPress={() => {
												setCurrentScreen('dashboard');
												setErrorMessage('');
										 }}
									>
										 <Text style={styles.secondaryButtonText}>Cancel</Text>
									</Pressable>
							 </View>
						)}
				 />
			</KeyboardAvoidingView>
	 );

	 return (
			<View style={styles.container}>
				 {currentScreen === 'dashboard' ? renderDashboard() : renderAddForm()}
			</View>
	 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7D0A49', // His dark magenta background
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    paddingBottom: 15,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827', // The dark text he used on the magenta background
    textAlign: 'center',
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#B04B7B',
    textAlign: 'center',
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
  menuItemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Frosted glass for the dashboard cards
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  dishNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // Changed to white for readability
    flex: 1,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00FF9D', // Brightened the green so it pops against the dark glass
  },
  courseTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Semi-transparent tag
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
    overflow: 'hidden',
  },
  descriptionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)', // Soft white for the description
    lineHeight: 20,
  },
  formContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004D40',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    color: '#FFFFFF',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
  },
  primaryButton: {
    backgroundColor: '#FF33B5', // His neon pink button
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 8,
  }
});
