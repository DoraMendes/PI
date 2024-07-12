// stats

import { render, screen, within } from '@testing-library/react'
import StatsPage from '../../../app/admin/dashboard-and-stats/page';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { attackTypePercentagesURL, attacksVSNonAttacksCountURL, dailyAttacksCountURL } from 'services/statistics';
import { attackVSNonAttackMock, attacksTypePercentagesMock, dailyAttackCountsMock } from 'mocks/statistics';

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


describe('Stats page', () => {
    beforeEach(() => {
        // first card
        mockAxios.onGet(dailyAttacksCountURL()).reply(200, dailyAttackCountsMock());

        // second card
        mockAxios.onGet(dailyAttacksCountURL()).reply(200, dailyAttackCountsMock());

        // first pie chart
        mockAxios.onGet(attacksVSNonAttacksCountURL()).reply(200, attackVSNonAttackMock());

        // second pie chart
        mockAxios.onGet(attackTypePercentagesURL()).reply(200, attacksTypePercentagesMock);
    })

    it('renders the card with attacks number', async () => {
        render(<StatsPage />)

        const cardContainer = screen.getByText('Attacks today').parentElement;
        const count = await within(cardContainer).findByText(dailyAttackCountsMock());
        expect(count).toBeInTheDocument();
    })

    it('renders the card with percentage of malicious attacks', async () => {
        render(<StatsPage />)

        const cardContainer = screen.getByText('Percentage of Bad Traffic').parentElement;
        const percentage = await within(cardContainer).findByText(dailyAttackCountsMock());
        expect(percentage).toBeInTheDocument();
    })

    it('renders a chart for attacks', () => {
        render(<StatsPage />)
        
        const lineChart = screen.getByTestId('line-chart');
        const chartTitle = screen.getByText(lineChartTitle);
        
        expect(lineChart).toBeInTheDocument();
        expect(chartTitle).toBeInTheDocument();
    })

    it('renders two pie chart (attacks by type AND Attacks by Type)', () => {
        render(<StatsPage />)

        const pieCharts = screen.getAllByTestId('pie-chart');
        expect(pieCharts.length).toBe(2);

        expect(screen.getByText('Attacks VS Non Attacks'));
        expect(screen.getByText('Attacks by Type'));
    })

    it('renders a map', () => {
        const {container} = render(<StatsPage />)
        const map = container.querySelector('div#map');
        expect(map).not.toBeUndefined();
    })
})
