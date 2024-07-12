// stats

import { render, screen, within } from '@testing-library/react'
import HistoryPage from '../../../app/admin/data-tables/page';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { predictionsRandomMock } from 'mocks/predictions';
import { filteredPredictionsURL } from 'services/predictions';

const mockAxios = new MockAdapter(axios);

// const firstRow = predictionsRandomMock.map((p) => p.createdDate)
const dates = predictionsRandomMock.map((p) => p.createdDate);

describe('Stats page', () => {
    beforeEach(() => {
        mockAxios.onGet(filteredPredictionsURL()).reply(200, predictionsRandomMock);
    })

    it('renders table', async () => {
        render(<HistoryPage />)

        await screen.findByText(predictionsRandomMock[0].protocol)
        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();
    })
    
})
