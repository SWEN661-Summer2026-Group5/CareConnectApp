import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Card, PrimaryButton} from '../components/ui';
import {useAppState} from '../state/AppState';

export interface ContactListScreenProps {
  onAddContact?: () => void;
  onOpenMenu?: () => void;
}

export default function ContactListScreen({
  onAddContact,
  onOpenMenu,
}: ContactListScreenProps) {
  const {sortedContacts, sortContactsAsc, toggleContactSort} = useAppState();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>

      <View style={styles.row}>
        <View style={styles.flex}>
          <PrimaryButton
            label="Add Contact"
            testID="contacts-add"
            onPress={() => onAddContact?.()}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{selected: sortContactsAsc}}
          testID="contacts-sort"
          onPress={toggleContactSort}
          style={styles.sortButton}>
          <Text>{sortContactsAsc ? '▲' : '▼'}</Text>
        </Pressable>
      </View>

      <ScrollView>
        {sortedContacts.map(contact => (
          <View key={contact.id} testID={`contact-card-${contact.id}`}>
            <Card>
              <Text style={styles.name}>{contact.name}</Text>
              {contact.role.length > 0 && (
                <Text style={styles.meta}>{contact.role}</Text>
              )}
              {contact.phone.length > 0 && (
                <Text style={styles.meta}>{contact.phone}</Text>
              )}
              {contact.email.length > 0 && (
                <Text style={styles.meta}>{contact.email}</Text>
              )}
            </Card>
          </View>
        ))}
      </ScrollView>

      <PrimaryButton
        label="MENU"
        testID="contacts-menu"
        onPress={() => onOpenMenu?.()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 24},
  title: {fontSize: 28, fontWeight: '600', marginBottom: 16},
  row: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
  flex: {flex: 1, marginRight: 12},
  sortButton: {
    width: 56,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#0B7074',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {fontSize: 20, fontWeight: '600', marginBottom: 4},
  meta: {color: '#17B5C3', marginBottom: 4},
});
