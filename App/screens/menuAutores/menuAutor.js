import * as React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, useWindowDimensions, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';

import Registro from './registro';
import UpdateInfo from './update';

export default function menu({ navigation }) {
    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, []));

    const FirstRoute = () => (
        <Registro navigation={navigation} />
    );

    const SecondRoute = () => (
        <UpdateInfo navigation={navigation} />
    );

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Registro' },
        { key: 'second', title: 'Actualizacion' },
    ]);

    return (
        <View style={{ flex: 1, }}>
            <View style={styles.header}>
                <TouchableOpacity style={{ width: 50 }} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-circle-outline" size={40} />
                </TouchableOpacity>
                <Text style={styles.headerT}>Autores</Text>
            </View>
            <TabView style={{ flex: 5 }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={props => <TabBar {...props} style={{ backgroundColor: 'black' }} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header:
    {
        flex: 0.6,
        alignItems: 'center',
        backgroundColor: '#1C5679',
        fontSize: 30,
        color: '#000',
        borderBottomColor: '#199187',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingTop: 10
    },
    headerT:
    {
        fontSize: 30,
        color: '#000',
        alignSelf: 'center',
        alignContent: 'center',
    },
});