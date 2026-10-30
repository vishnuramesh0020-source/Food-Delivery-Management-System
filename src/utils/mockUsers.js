// Default initial users for authentication testing

export const INITIAL_USERS = [
  {
    id: 'user-1',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    password: 'Password123!',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    addresses: [
      {
        id: 'addr-1',
        title: 'Home',
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        zipCode: '97477',
        phone: '+1 (555) 234-5678',
        isDefault: true
      },
      {
        id: 'addr-2',
        title: 'Work / Office',
        street: '400 Cyberdyne Blvd, Suite 300',
        city: 'Sunnyvale',
        state: 'CA',
        zipCode: '94086',
        phone: '+1 (555) 987-6543',
        isDefault: false
      }
    ]
  },
  {
    id: 'user-2',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'Password123!',
    phone: '+1 (555) 876-5432',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    addresses: [
      {
        id: 'addr-3',
        title: 'Home',
        street: '123 Market Street, Apt 4B',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94103',
        phone: '+1 (555) 876-5432',
        isDefault: true
      }
    ]
  }
];
