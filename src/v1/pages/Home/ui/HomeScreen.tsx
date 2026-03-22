import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Alert,
} from 'react-native';
import { SearchType } from '../../../../services/ItemService';
import ProductSearchBar from '../../../features/products/search/ui/ProductSearchBar';
import { ProductSearchType, SearchResult } from '../../../features/products/search/model/type';
import HomeProductsPanel from '../../../features/products/search/ui/HomeProductsPanel';
import { searchApi } from '../../../features/products/search/api/productSearchApi';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { ROOT_PARAM_LIST } from '../../../../models/navigation';
import { Product } from '../../../entities/products/models/types';
import AuthService from '../../../../services/AuthService';
import { apiClient } from '../../../../services/ApiService';
const DEBOUNCE_DELAY = 500; // 500ms debounce delay
const MIN_SEARCH_LENGTH = 4; // Minimum characters to trigger search


export default function HomeScreen() {
    const navigation = useNavigation<NavigationProp<ROOT_PARAM_LIST>>();
    // Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [searchQueryResults, setSearchQueryResults] = useState<SearchResult | null>(null);
    // Pull-to-refresh states
    const [refreshing, setRefreshing] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    // Search functionality
    const performSearch = async (searchType: SearchType, value: string) => {
        if (value.length < MIN_SEARCH_LENGTH) {
            setIsSearching(false);
            return;
        }

        try {
            setIsSearching(true);
            const results = await searchApi.lookupItems({ search_type: searchType as SearchType, value: value.trim() });
            if (results.success && results.payload) {
                setSearchQueryResults(results.payload);
            }
        } catch (error) {
            console.error('Search error:', error);
            Alert.alert('Error', 'Failed to search items. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    // Debounced search effect
    useEffect(() => {
        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // If query is empty, reset
        if (searchQuery.length === 0) {
            setIsSearching(false);
            return;
        }

        // If query is less than minimum length, don't search yet
        if (searchQuery.length < MIN_SEARCH_LENGTH) {
            setIsSearching(false);
            return;
        }

        // Set searching state while waiting for debounce
        setIsSearching(true);

        // Set new debounce timer
        debounceTimerRef.current = setTimeout(() => {
            performSearch('code', searchQuery);
        }, DEBOUNCE_DELAY);

        // Cleanup function
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchQuery]);

    // Clean up debounce timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const oldRefreshToken = async () => {
        const token = await AuthService.getRefreshToken();
        console.log('old refresh token:', token);
    }

    const refreshedIdToken = async () => {
        const token = await AuthService.refreshToken();
        console.log('refreshed firebase id token:', token);
    }

    const newRefreshToken = async () => {
        const token = await AuthService.getRefreshToken();
        console.log('new refresh token:', token);
    }


    // then immediately call protected api
    const req = async () => {
        // startDate: 2026-03-15
        // endDate: 2026-03-31
        const res = await apiClient.get('/api/v1/products/expiring-stocks?startDate=2026-03-15&endDate=2026-03-31');
        console.log('protected api after refresh:', res);
    }


    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            if (searchQuery.length >= MIN_SEARCH_LENGTH) {
                await performSearch('code', searchQuery);
            } else {
                setRefreshTrigger((prev) => prev + 1);
            }
        } finally {
            setRefreshing(false);
        }
    };

    const onClickProduct = (product: Product) => {
        navigation.navigate('ProductDetail', { product: product, product_id: product.product_id });
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <ProductSearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSearch={(query: string, searchType: ProductSearchType) => {
                    // Manual search trigger (when user clicks search button)
                    if (debounceTimerRef.current) {
                        clearTimeout(debounceTimerRef.current);
                    }
                    performSearch(searchType as SearchType, query);
                }}
                isSearching={isSearching}
                disabled={false}
            />


            {/* Products Panel */}
            <HomeProductsPanel
                onClickProduct={onClickProduct}
                style={{ paddingVertical: 16, flex: 1 }}
                isSearching={isSearching || searchQuery.length >= MIN_SEARCH_LENGTH}
                searchedList={searchQueryResults?.results || []}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                refreshTrigger={refreshTrigger}
            />
        </View>
    );
}
