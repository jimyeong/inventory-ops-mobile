import { apiClient, ServiceResponse } from '../../../../../services/ApiService';
import { SearchResult, SearchType } from '../model/type';
import { V1ApiResponse } from '../../../../shared/api/apiClient';
import { SearchInventoryRequest } from '../model/type';

export const searchApi = {
    lookupItems: async (params: SearchInventoryRequest): Promise<V1ApiResponse<SearchResult>> => {
        const response = await apiClient.post("/api/v1/inventory/search", params);
        return response.data;
    }
}
// export async function lookupItems(searchType: SearchType, value: string): Promise<ServiceResponse<SearchResult>> {
//     try {
//         const response = await apiClient.post('/api/v1/lookupItems', {
//             search_type: searchType,
//             value: value
//         });
//         /// fix
//         const processed = response.data.payload.searchItems.map((item: any) => {
//             return {
//                 item: {
//                     ...item.item,
//                     product_id: item.item.id
//                 },
//                 tag_names: item.tag_names
//             }
//         });
//         console.log("@@@@processed@@@@@@@", processed);
//         response.data.payload.searchItems = processed;
//         return response.data;
//     } catch (error) {
//         console.error('Error looking up items:', error);
//         throw error;
//     }
// }