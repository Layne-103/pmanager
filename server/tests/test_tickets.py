"""
Tests for ticket endpoints
"""
import pytest
from fastapi import status


class TestTicketCreation:
    """Tests for creating tickets"""
    
    def test_create_ticket_with_title_only(self, client):
        """Test creating a ticket with only a title"""
        response = client.post(
            "/api/tickets",
            json={"title": "Test Ticket"}
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["title"] == "Test Ticket"
        assert data["description"] == ""
        assert data["is_completed"] == False
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data
    
    def test_create_ticket_with_title_and_description(self, client):
        """Test creating a ticket with title and description"""
        response = client.post(
            "/api/tickets",
            json={
                "title": "Test Ticket",
                "description": "This is a test description"
            }
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["title"] == "Test Ticket"
        assert data["description"] == "This is a test description"
    
    def test_create_ticket_without_title(self, client):
        """Test that creating a ticket without a title fails"""
        response = client.post(
            "/api/tickets",
            json={"description": "No title"}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_create_ticket_with_empty_title(self, client):
        """Test that creating a ticket with empty title fails"""
        response = client.post(
            "/api/tickets",
            json={"title": ""}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_create_ticket_with_long_title(self, client):
        """Test creating a ticket with maximum length title"""
        long_title = "A" * 200
        response = client.post(
            "/api/tickets",
            json={"title": long_title}
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["title"] == long_title
    
    def test_create_ticket_with_too_long_title(self, client):
        """Test that creating a ticket with too long title fails"""
        too_long_title = "A" * 201
        response = client.post(
            "/api/tickets",
            json={"title": too_long_title}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestTicketRetrieval:
    """Tests for retrieving tickets"""
    
    def test_get_empty_ticket_list(self, client):
        """Test getting tickets when none exist"""
        response = client.get("/api/tickets")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "tickets" in data
        assert isinstance(data["tickets"], list)
        assert len(data["tickets"]) == 0
        assert data["total"] == 0
    
    def test_get_tickets(self, client):
        """Test getting tickets after creating some"""
        # Create tickets
        client.post("/api/tickets", json={"title": "Ticket 1"})
        client.post("/api/tickets", json={"title": "Ticket 2"})
        
        # Get tickets
        response = client.get("/api/tickets")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["tickets"]) == 2
        assert data["total"] == 2
    
    def test_get_single_ticket(self, client):
        """Test getting a single ticket by ID"""
        # Create ticket
        create_response = client.post(
            "/api/tickets",
            json={"title": "Single Ticket", "description": "Test"}
        )
        ticket_id = create_response.json()["id"]
        
        # Get ticket
        response = client.get(f"/api/tickets/{ticket_id}")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == ticket_id
        assert data["title"] == "Single Ticket"
        assert data["description"] == "Test"
    
    def test_get_nonexistent_ticket(self, client):
        """Test getting a ticket that doesn't exist"""
        response = client.get("/api/tickets/99999")
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestTicketUpdate:
    """Tests for updating tickets"""
    
    def test_update_ticket_title(self, client):
        """Test updating a ticket's title"""
        # Create ticket
        create_response = client.post("/api/tickets", json={"title": "Original"})
        ticket_id = create_response.json()["id"]
        
        # Update ticket
        response = client.put(
            f"/api/tickets/{ticket_id}",
            json={"title": "Updated"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["title"] == "Updated"
    
    def test_update_ticket_completion_status(self, client):
        """Test toggling ticket completion status"""
        # Create ticket
        create_response = client.post("/api/tickets", json={"title": "Test"})
        ticket_id = create_response.json()["id"]
        
        # Toggle complete
        response = client.patch(f"/api/tickets/{ticket_id}/complete")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["is_completed"] == True
        
        # Toggle back
        response = client.patch(f"/api/tickets/{ticket_id}/complete")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["is_completed"] == False
    
    def test_update_nonexistent_ticket(self, client):
        """Test updating a ticket that doesn't exist"""
        response = client.put(
            "/api/tickets/99999",
            json={"title": "Updated"}
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestTicketDeletion:
    """Tests for deleting tickets"""
    
    def test_delete_ticket(self, client):
        """Test deleting a ticket"""
        # Create ticket
        create_response = client.post("/api/tickets", json={"title": "To Delete"})
        ticket_id = create_response.json()["id"]
        
        # Delete ticket
        response = client.delete(f"/api/tickets/{ticket_id}")
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify deletion
        get_response = client.get(f"/api/tickets/{ticket_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_nonexistent_ticket(self, client):
        """Test deleting a ticket that doesn't exist"""
        response = client.delete("/api/tickets/99999")
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestTicketFiltering:
    """Tests for filtering tickets"""
    
    def test_filter_by_status_open(self, client):
        """Test filtering tickets by open status"""
        # Create tickets
        client.post("/api/tickets", json={"title": "Open 1"})
        create_response = client.post("/api/tickets", json={"title": "Completed 1"})
        ticket_id = create_response.json()["id"]
        client.patch(f"/api/tickets/{ticket_id}/complete")
        
        # Filter by open
        response = client.get("/api/tickets?status=open")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["tickets"]) == 1
        assert data["tickets"][0]["is_completed"] == False
    
    def test_filter_by_status_completed(self, client):
        """Test filtering tickets by completed status"""
        # Create tickets
        client.post("/api/tickets", json={"title": "Open 1"})
        create_response = client.post("/api/tickets", json={"title": "Completed 1"})
        ticket_id = create_response.json()["id"]
        client.patch(f"/api/tickets/{ticket_id}/complete")
        
        # Filter by completed
        response = client.get("/api/tickets?status=completed")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["tickets"]) == 1
        assert data["tickets"][0]["is_completed"] == True
    
    def test_search_tickets_by_title(self, client):
        """Test searching tickets by title"""
        # Create tickets
        client.post("/api/tickets", json={"title": "Important task"})
        client.post("/api/tickets", json={"title": "Regular task"})
        client.post("/api/tickets", json={"title": "Another important thing"})
        
        # Search for "important"
        response = client.get("/api/tickets?search=important")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["tickets"]) == 2
        assert all("important" in t["title"].lower() for t in data["tickets"])
    
    def test_search_case_insensitive(self, client):
        """Test that search is case-insensitive"""
        # Create ticket
        client.post("/api/tickets", json={"title": "Important Task"})
        
        # Search with different cases
        for search_term in ["important", "IMPORTANT", "ImPoRtAnT"]:
            response = client.get(f"/api/tickets?search={search_term}")
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            assert len(data["tickets"]) == 1
