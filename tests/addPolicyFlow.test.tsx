import { render, fireEvent } from '@testing-library/react-native';
import NewPolicy from '../app/policy/new';
import { Provider } from 'react-redux';
import { store } from '../src/store';

test('creates a new policy', () => {
  const { getByText, getByLabelText } = render(
    <Provider store={store}><NewPolicy/></Provider>
  );
  fireEvent.changeText(getByLabelText('Provider'), 'Acme');
  fireEvent.press(getByText('Save'));
  // You can assert store state directly
  const state: any = store.getState();
  const all = Object.values(state.policies.entities);
  expect(all.length).toBe(1);
  expect((all[0] as any)?.provider).toBe('Acme');
});
