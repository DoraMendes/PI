// real time

import { act, render, screen, within } from '@testing-library/react'
import RealTimePage from '../../../app/admin/default/page';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { prediction } from 'mocks/predictions';

const mockAxios = new MockAdapter(axios);
const lineChartTitle = "Attacks in the last 5 minutes";

jest.mock('../../../components/charts/PieChart', () => ({
    __esModule: true,
    default: () => (<div data-testid="pie-chart"></div>)
}))

jest.mock('../../../components/charts/LineChart', () => ({
    __esModule: true,
    default: () => (<div></div>)
}))

jest.mock('../../../views/admin/default/components/AttacksInTheLast5Min', () => ({
    __esModule: true,
    default: () => (<div data-testid="line-chart">{lineChartTitle}</div>)
}))

let callback = jest.fn();

jest.mock('../../../socket', () => ({
  WebsocketClient: class {
    static init = jest.fn();
    static notifyListeners = jest.fn();
    static addListener= (fn: any) => callback = fn;
  }
}))

describe('Real time page', () => {
    beforeEach(() => {
    })

    it('renders the card with attacks number of today', async () => {
      render(<RealTimePage />)

      const cardContainer = screen.getByText('Attacks today').parentElement;

      for (let index = 0; index < 100; index++) {
        act(() => {
          callback(JSON.stringify(prediction()));
        })
        const count = await within(cardContainer).findByText(index + 1);
        expect(count).toBeInTheDocument();
      }
    })

    it('renders the card with percentage of malicious attacks of today', async () => {
      render(<RealTimePage />)
      
      const cardContainer = screen.getByText('Malicious Traffic Today').parentElement;
      

      for (let index = 0; index < 100; index++) {
        act(() => {
          callback(JSON.stringify(prediction({attack: index > 49})));
        })

      }
        const percentage = await within(cardContainer).findByText('50.00');
        expect(percentage).toBeInTheDocument();
    })

    it('websocket add listener catch error and attack count is zero', async () => {
      render(<RealTimePage />)

      callback(JSON.stringify(null));

      const cardContainer = screen.getByText('Attacks today').parentElement;
      const count = await within(cardContainer).findByText(0);
      expect(count).toBeInTheDocument();
    })

    it('renders a chart for attacks in the last 5 minutes', () => {
      render(<RealTimePage />)

      const lineChart = screen.getByTestId('line-chart');
      const chartTitle = screen.getByText(lineChartTitle);

      expect(lineChart).toBeInTheDocument();
      expect(chartTitle).toBeInTheDocument();

    })

    it('renders 2 pie charts (attacks vs non attacks AND attacks by type)', () => {
      render(<RealTimePage />)
      const pieCharts = screen.getAllByTestId('pie-chart');
      expect(pieCharts.length).toBe(2);

      expect(screen.getByText('Attacks VS Non Attacks'));
      expect(screen.getByText('Attacks by Type'));
    })

    it('renders a map', () => {
      const {container} = render(<RealTimePage />)
      const map = container.querySelector('div#map');
      expect(map).not.toBeUndefined();
    })
})