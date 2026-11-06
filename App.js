import React, { useState, useMemo } from 'react';
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

	const [menuItems, setMenuItems] = useState([
		{ id: '1', dishName: 'Garlic Bread', description: 'Freshly baked with garlic butter', course: 'Starter', price: '45' },
		{ id: '2', dishName: 'Rump Steak', description: '300g prime beef with peppercorn sauce', course: 'Main', price: '185' },
		{ id: '3', dishName: 'Ice Cream', description: 'Vanilla bean ice cream', course: 'Dessert', price: '45' },
	]);

	const [editingId, setEditingId] = useState(null);
	const [dishName, setDishName] = useState('');
	const [description, setDescription] = useState('');
	const [course, setCourse] = useState('Starter');
	const [price, setPrice] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const [searchQuery, setSearchQuery] = useState('');
	const [selectedFilter, setSelectedFilter] = useState('All');

	const handleSaveItem = () => {
		if (!dishName.trim() || !description.trim() || !course || !price.trim()) {
			setErrorMessage('Please fill out all fields to save this dish.');
			return;
		}

		const numericPrice = parseFloat(price);
		if (isNaN(numericPrice) || numericPrice <= 0) {
			setErrorMessage('Please enter a valid price greater than 0.');
			return;
		}

		const newItem = {
			id: Math.random().toString(),
			dishName: dishName.trim(),
			description: description.trim(),
			course,
			price: numericPrice.toFixed(2)
		};

		setMenuItems([...menuItems, newItem]);
		resetForm();
		Alert.alert('Success', 'Dish added to the menu successfully!');
		setCurrentScreen('dashboard');
	};

	const handleEditPress = (item) => {
		setEditingId(item.id);
		setDishName(item.dishName);
		setDescription(item.description);
		setCourse(item.course);
		setPrice(item.price.toString());
		setErrorMessage('');
		setCurrentScreen('editForm');
	};

	const handleUpdateItem = () => {
		if (!dishName.trim() || !description.trim() || !course || !price.trim()) {
			setErrorMessage('Please fill out all fields to update this dish.');
			return;
		}

		const numericPrice = parseFloat(price);
		if (isNaN(numericPrice) || numericPrice <= 0) {
			setErrorMessage('Please enter a valid price greater than 0.');
			return;
		}

		setMenuItems(prevItems =>
			prevItems.map(item =>
				item.id === editingId
					? { ...item, dishName: dishName.trim(), description: description.trim(), course, price: numericPrice.toFixed(2) }
					: item
			)
		);

		resetForm();
		Alert.alert('Success', 'Dish updated successfully!');
		setCurrentScreen('dashboard');
	};

	const handleDeleteItem = (id, name) => {
		Alert.alert(
			'Delete Dish',
			`Are you sure you want to remove "${name}"?`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => setMenuItems(prevItems => prevItems.filter(item => item.id !== id))
				}
			]
		);
	};

	const resetForm = () => {
		setEditingId(null);
		setDishName('');
		setDescription('');
		setCourse('Starter');
		setPrice('');
		setErrorMessage('');
	};

	const filteredMenuItems = useMemo(() => {
		return menuItems.filter(item => {
			const matchesSearch = item.dishName.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesFilter = selectedFilter === 'All' || item.course === selectedFilter;
			return matchesSearch && matchesFilter;
		});
	}, [menuItems, searchQuery, selectedFilter]);

	const stats = useMemo(() => {
		const total = menuItems.length;
		const totalSum = menuItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
		const average = total > 0 ? (totalSum / total).toFixed(2) : '0.00';
		const counts = { Starter: 0, Main: 0, Dessert: 0 };
		menuItems.forEach(item => { if (counts[item.course] !== undefined) counts[item.course]++; });
		return { total, average, counts };
	}, [menuItems]);

	const renderDashboard = () => (
		<View style={styles.screen}>
			<View style={styles.header}>
				<Text style={styles.appTitle}>Christoffel's</Text>
				<Text style={styles.screenSubtitle}>Menu Dashboard</Text>
			</View>

			<View style={styles.statsCard}>
				<Text style={styles.statsTitle}>Menu Statistics</Text>
				<View style={styles.statsRow}>
					<View style={styles.statBox}>
						<Text style={styles.statValue}>{stats.total}</Text>
						<Text style={styles.statLabel}>Total</Text>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statBox}>
						<Text style={styles.statValue}>R{stats.average}</Text>
						<Text style={styles.statLabel}>Average</Text>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statBox}>
						<Text style={styles.statValue}>
							S:{stats.counts.Starter} M:{stats.counts.Main} D:{stats.counts.Dessert}
						</Text>
						<Text style={styles.statLabel}>By Course</Text>
					</View>
				</View>
			</View>

			<View style={styles.searchFilterContainer}>
				<TextInput
					style={styles.searchInput}
					placeholder="Search dishes..."
					placeholderTextColor="rgba(255, 255, 255, 0.6)"
					value={searchQuery}
					onChangeText={setSearchQuery}
				/>
			</View>


			<Text style={styles.label}>Filter by:</Text>
			<View style={styles.filterPickerContainer}>
				<Picker
					selectedValue={selectedFilter}
					onValueChange={(itemValue) => setSelectedFilter(itemValue)}
					style={styles.filterPicker}
					itemStyle={styles.picketItemIOS}
				>
					<Picker.Item label="All Courses" value="All"/>
					<Picker.Item label="Starter" value="Starter"/>
					<Picker.Item label="Main" value="Main"/>
				  <Picker.Item label="Dessert" value="Dessert"/>
			  </Picker>
			</View>

			<FlatList
				data={filteredMenuItems}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContainer}
				ListEmptyComponent={
					<Text style={styles.emptyMessage}>
						{menuItems.length === 0 ? "No dishes available. Add a new dish below." : "No dishes match your search."}
					</Text>
				}
				renderItem={({ item }) => (
					<View style={styles.menuItemCard}>
						<View style={styles.cardHeader}>
							<Text style={styles.dishNameText}>{item.dishName}</Text>
							<Text style={styles.priceText}>R{item.price}</Text>
						</View>
						<Text style={styles.courseTag}>{item.course}</Text>
						<Text style={styles.descriptionText}>{item.description}</Text>
						<View style={styles.cardActions}>
							<Pressable style={styles.editButton} onPress={() => handleEditPress(item)}>
								<Text style={styles.actionButtonText}>Edit</Text>
							</Pressable>
							<Pressable style={styles.deleteButton} onPress={() => handleDeleteItem(item.id, item.dishName)}>
								<Text style={styles.actionButtonText}>Delete</Text>
							</Pressable>
						</View>
					</View>
				)}
			/>

			<Pressable
				style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
				onPress={() => {
					resetForm();
					setCurrentScreen('addForm');
				}}
			>
				<Text style={styles.primaryButtonText}>+ Add New Dish</Text>
			</Pressable>
		</View>
	);

	const renderForm = (isEditMode) => (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.screen}>
			<View style={styles.header}>
				<Text style={styles.appTitle}>{isEditMode ? 'Edit Dish' : 'Add New Dish'}</Text>
			</View>

			{errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

			<FlatList
				data={[{ key: 'form' }]}
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
							onPress={isEditMode ? handleUpdateItem : handleSaveItem}
						>
							<Text style={styles.primaryButtonText}>{isEditMode ? 'Save Changes' : 'Save Menu Item'}</Text>
						</Pressable>

						<Pressable
							style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
							onPress={() => {
								setCurrentScreen('dashboard');
								resetForm();
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
			{currentScreen === 'dashboard' ? renderDashboard() : renderForm(currentScreen === 'editForm')}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#7D0A49',
	},
	screen: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 50,
		paddingBottom: 30,
	},
	header: {
		marginBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(255,255,255,0.3)',
		paddingBottom: 15,
	},
	appTitle: {
		fontSize: 28,
		fontWeight: '900',
		color: '#111827',
		textAlign: 'center',
	},
	screenSubtitle: {
		fontSize: 16,
		color: '#B04B7B',
		textAlign: 'center',
		marginTop: 4,
	},
	statsCard: {
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
		borderRadius: 12,
		padding: 12,
		marginBottom: 15,
	},
	statsTitle: {
		color: '#FFFFFF',
		fontSize: 14,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 8,
		textTransform: 'uppercase',
	},
	statsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	statBox: {
		flex: 1,
		alignItems: 'center',
	},
	statDivider: {
		width: 1,
		height: '80%',
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	statValue: {
		color: '#00FF9D',
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 2,
	},
	statLabel: {
		color: 'rgba(255,255,255,0.7)',
		fontSize: 10,
		textTransform: 'uppercase',
	},
	searchFilterContainer: {
		flexDirection: 'column', 
		gap: 12, 
		marginBottom: 20,
	},
	searchInput: {
		width: '100%', 
		backgroundColor: 'rgba(255, 255, 255, 0.15)',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.3)',
		padding: 12,
		borderRadius: 10,
		fontSize: 14,
		color: '#FFFFFF',
	},
	filterPickerContainer: {
		width: '100%', 
		backgroundColor: 'rgba(255, 255, 255, 0.15)',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.3)',
		borderRadius: 10,
		justifyContent: 'center',
		height: Platform.OS === 'ios' ? 140 : 50,
		overflow: 'hidden',
	},
	filterPicker: {
		color: '#FFFFFF',
		width: '100%',
	},
  pickerItemIOS: {
			color: '#FFFFFF',
			height: 140,
			fontSize: 16,
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
		backgroundColor: 'rgba(255, 255, 255, 0.15)',
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.3)',
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	dishNameText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#FFFFFF',
		flex: 1,
	},
	priceText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#00FF9D',
	},
	courseTag: {
		fontSize: 12,
		fontWeight: '600',
		color: '#FFFFFF',
		backgroundColor: 'rgba(255, 255, 255, 0.25)',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		alignSelf: 'flex-start',
		marginVertical: 8,
		overflow: 'hidden',
	},
	descriptionText: {
		fontSize: 14,
		color: 'rgba(255, 255, 255, 0.7)',
		lineHeight: 20,
	},
	cardActions: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: 10,
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: 'rgba(255, 255, 255, 0.2)',
	},
	editButton: {
		backgroundColor: '#1E40AF',
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 6,
	},
	deleteButton: {
		backgroundColor: '#991B1B',
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 6,
	},
	actionButtonText: {
		color: '#FFFFFF',
		fontSize: 12,
		fontWeight: 'bold',
	},
	formContainer: {
		flex: 1,
	},
	label: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#FFFFFF',
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
		justifyContent: 'center',
		height: Platform.OS === 'ios' ? 140 : 50,
		overflow: 'hidden',
	},
	
	picker: {
		color: '#FFFFFF',
	},
	primaryButton: {
		backgroundColor: '#FF33B5',
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
