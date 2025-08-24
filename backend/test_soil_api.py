#!/usr/bin/env python3
"""
Test script for AgriShakti Soil Analysis API
Run this to verify the API is working correctly
"""
import requests
import json
from datetime import datetime, timedelta

# API base URL
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure it's running on port 8000")
        return False

def test_root_endpoint():
    """Test the root endpoint"""
    print("\n🔍 Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ Root endpoint working")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
        return False

def test_get_soil_analysis():
    """Test the GET soil analysis endpoint"""
    print("\n🔍 Testing GET soil analysis endpoint...")
    try:
        # Test coordinates (Mumbai area)
        lat, lon = 19.0760, 72.8777
        response = requests.get(f"{BASE_URL}/api/soil-analysis/{lat}/{lon}")
        
        if response.status_code == 200:
            print("✅ GET soil analysis working")
            data = response.json()
            print(f"   Success: {data.get('success')}")
            print(f"   Status: {data.get('data', {}).get('status')}")
            print(f"   NDVI: {data.get('data', {}).get('ndvi')}")
            print(f"   pH: {data.get('data', {}).get('soilData', {}).get('ph')}")
        else:
            print(f"❌ GET soil analysis failed: {response.status_code}")
            print(f"   Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ GET soil analysis error: {e}")
        return False

def test_post_soil_analysis():
    """Test the POST soil analysis endpoint"""
    print("\n🔍 Testing POST soil analysis endpoint...")
    try:
        # Prepare test data
        end_date = datetime.now()
        start_date = end_date - timedelta(days=90)
        
        test_data = {
            "latitude": 19.0760,
            "longitude": 72.8777,
            "buffer_meters": 100,
            "start_date": start_date.strftime("%Y-%m-%d"),
            "end_date": end_date.strftime("%Y-%m-%d")
        }
        
        response = requests.post(
            f"{BASE_URL}/api/soil-analysis",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ POST soil analysis working")
            data = response.json()
            print(f"   Success: {data.get('success')}")
            print(f"   Status: {data.get('data', {}).get('status')}")
            print(f"   NDVI: {data.get('data', {}).get('ndvi')}")
            print(f"   pH: {data.get('data', {}).get('soilData', {}).get('ph')}")
            print(f"   Recommendations: {len(data.get('data', {}).get('recommendations', []))}")
        else:
            print(f"❌ POST soil analysis failed: {response.status_code}")
            print(f"   Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ POST soil analysis error: {e}")
        return False

def test_api_documentation():
    """Test if API documentation is accessible"""
    print("\n🔍 Testing API documentation...")
    try:
        response = requests.get(f"{BASE_URL}/docs")
        if response.status_code == 200:
            print("✅ API documentation accessible")
            print(f"   Available at: {BASE_URL}/docs")
        else:
            print(f"❌ API documentation not accessible: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ API documentation error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting AgriShakti Soil Analysis API Tests")
    print("=" * 50)
    
    tests = [
        test_health_check,
        test_root_endpoint,
        test_get_soil_analysis,
        test_post_soil_analysis,
        test_api_documentation
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The API is working correctly.")
        print("\n📖 Next steps:")
        print("   1. The API is ready for frontend integration")
        print("   2. Check the documentation at http://localhost:8000/docs")
        print("   3. Test with the SoilTestingCard component")
    else:
        print("⚠️  Some tests failed. Check the API logs for details.")
        print("\n🔧 Troubleshooting:")
        print("   1. Make sure the API is running: python start_soil_api.py")
        print("   2. Check if port 8000 is available")
        print("   3. Verify all dependencies are installed")
    
    return passed == total

if __name__ == "__main__":
    main()
