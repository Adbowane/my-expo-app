import { StyleSheet } from 'react-native';

const PURPLE = '#7B5CF0';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 4,
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 3,
    backgroundColor: PURPLE,
    borderRadius: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    backgroundColor: 'transparent',
  },
  iconWrapperActive: {
    backgroundColor: PURPLE,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  labelActive: {
    color: PURPLE,
    fontWeight: '700',
  },
});
