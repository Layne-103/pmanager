"""
Tests for tag endpoints
"""
import pytest
from fastapi import status


class TestTagCreation:
    """Tests for creating tags"""

    def test_create_tag(self, client):
        """Test creating a tag"""
        response = client.post(
            "/api/tags",
            json={"name": "bug", "color": "#ff0000"}
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == "bug"
        assert data["color"] == "#ff0000"
        assert "id" in data
        assert "created_at" in data

    def test_create_tag_without_name(self, client):
        """Test that creating a tag without a name fails"""
        response = client.post(
            "/api/tags",
            json={"color": "#ff0000"}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_create_tag_without_color(self, client):
        """Test that creating a tag without a color fails"""
        response = client.post(
            "/api/tags",
            json={"name": "bug"}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_create_duplicate_tag(self, client):
        """Test that creating a duplicate tag fails"""
        # Create first tag
        client.post("/api/tags", json={"name": "bug", "color": "#ff0000"})

        # Try to create duplicate
        response = client.post(
            "/api/tags",
            json={"name": "bug", "color": "#00ff00"}
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_tag_case_insensitive_duplicate(self, client):
        """Test that tag names are case-insensitive for duplicates"""
        # Create first tag
        client.post("/api/tags", json={"name": "bug", "color": "#ff0000"})

        # Try to create with different case
        response = client.post(
            "/api/tags",
            json={"name": "BUG", "color": "#00ff00"}
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST


class TestTagRetrieval:
    """Tests for retrieving tags"""

    def test_get_empty_tag_list(self, client):
        """Test getting tags when none exist"""
        response = client.get("/api/tags")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0

    def test_get_tags(self, client):
        """Test getting tags after creating some"""
        # Create tags
        client.post("/api/tags", json={"name": "bug", "color": "#ff0000"})
        client.post("/api/tags", json={"name": "feature", "color": "#00ff00"})

        # Get tags
        response = client.get("/api/tags")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 2
        # Check that ticket_count is included
        assert all("ticket_count" in tag for tag in data)

    def test_get_single_tag(self, client):
        """Test getting a single tag by ID"""
        # Create tag
        create_response = client.post(
            "/api/tags",
            json={"name": "urgent", "color": "#ff0000"}
        )
        tag_id = create_response.json()["id"]

        # Get tag
        response = client.get(f"/api/tags/{tag_id}")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == tag_id
        assert data["name"] == "urgent"

    def test_get_nonexistent_tag(self, client):
        """Test getting a tag that doesn't exist"""
        response = client.get("/api/tags/99999")
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestTagUpdate:
    """Tests for updating tags"""

    def test_update_tag_name(self, client):
        """Test updating a tag's name"""
        # Create tag
        create_response = client.post(
            "/api/tags",
            json={"name": "original", "color": "#ff0000"}
        )
        tag_id = create_response.json()["id"]

        # Update tag
        response = client.put(
            f"/api/tags/{tag_id}",
            json={"name": "updated", "color": "#ff0000"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == "updated"

    def test_update_tag_color(self, client):
        """Test updating a tag's color"""
        # Create tag
        create_response = client.post(
            "/api/tags",
            json={"name": "test", "color": "#ff0000"}
        )
        tag_id = create_response.json()["id"]

        # Update color
        response = client.put(
            f"/api/tags/{tag_id}",
            json={"name": "test", "color": "#00ff00"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["color"] == "#00ff00"

    def test_update_nonexistent_tag(self, client):
        """Test updating a tag that doesn't exist"""
        response = client.put(
            "/api/tags/99999",
            json={"name": "updated", "color": "#ff0000"}
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestTagDeletion:
    """Tests for deleting tags"""

    def test_delete_tag(self, client):
        """Test deleting a tag"""
        # Create tag
        create_response = client.post(
            "/api/tags",
            json={"name": "to_delete", "color": "#ff0000"}
        )
        tag_id = create_response.json()["id"]

        # Delete tag
        response = client.delete(f"/api/tags/{tag_id}")
        assert response.status_code == status.HTTP_204_NO_CONTENT

        # Verify deletion
        get_response = client.get(f"/api/tags/{tag_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_nonexistent_tag(self, client):
        """Test deleting a tag that doesn't exist"""
        response = client.delete("/api/tags/99999")
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestTagSearch:
    """Tests for searching tags"""

    def test_search_tags_by_name(self, client):
        """Test searching tags by name"""
        # Create tags
        client.post("/api/tags", json={"name": "bug-fix", "color": "#ff0000"})
        client.post("/api/tags", json={"name": "feature", "color": "#00ff00"})
        client.post("/api/tags", json={"name": "bug-report", "color": "#ff00ff"})

        # Search for "bug"
        response = client.get("/api/tags?search=bug")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 2
        assert all("bug" in tag["name"].lower() for tag in data)

    def test_search_case_insensitive(self, client):
        """Test that search is case-insensitive"""
        # Create tag
        client.post("/api/tags", json={"name": "Important", "color": "#ff0000"})

        # Search with different cases
        for search_term in ["important", "IMPORTANT", "ImPoRtAnT"]:
            response = client.get(f"/api/tags?search={search_term}")
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            assert len(data) == 1


class TestTicketTagAssociation:
    """Tests for associating tags with tickets"""

    def test_add_tag_to_ticket(self, client):
        """Test adding a tag to a ticket"""
        # Create ticket and tag
        ticket_response = client.post("/api/tickets", json={"title": "Test"})
        ticket_id = ticket_response.json()["id"]

        tag_response = client.post("/api/tags", json={"name": "bug", "color": "#ff0000"})
        tag_id = tag_response.json()["id"]

        # Add tag to ticket
        response = client.post(f"/api/tickets/{ticket_id}/tags/{tag_id}")
        assert response.status_code == status.HTTP_200_OK

        # Verify tag is associated
        ticket = client.get(f"/api/tickets/{ticket_id}").json()
        assert len(ticket["tags"]) == 1
        assert ticket["tags"][0]["id"] == tag_id

    def test_remove_tag_from_ticket(self, client):
        """Test removing a tag from a ticket"""
        # Create ticket and tag
        ticket_response = client.post("/api/tickets", json={"title": "Test"})
        ticket_id = ticket_response.json()["id"]

        tag_response = client.post("/api/tags", json={"name": "bug", "color": "#ff0000"})
        tag_id = tag_response.json()["id"]

        # Add tag
        client.post(f"/api/tickets/{ticket_id}/tags/{tag_id}")

        # Remove tag
        response = client.delete(f"/api/tickets/{ticket_id}/tags/{tag_id}")
        assert response.status_code == status.HTTP_200_OK

        # Verify tag is removed
        ticket = client.get(f"/api/tickets/{ticket_id}").json()
        assert len(ticket["tags"]) == 0

    def test_filter_tickets_by_tag(self, client):
        """Test filtering tickets by tag"""
        # Create tags
        bug_tag = client.post("/api/tags", json={"name": "bug", "color": "#ff0000"}).json()
        feature_tag = client.post("/api/tags", json={"name": "feature", "color": "#00ff00"}).json()

        # Create tickets
        ticket1 = client.post("/api/tickets", json={"title": "Bug ticket"}).json()
        ticket2 = client.post("/api/tickets", json={"title": "Feature ticket"}).json()
        ticket3 = client.post("/api/tickets", json={"title": "Mixed ticket"}).json()

        # Add tags
        client.post(f"/api/tickets/{ticket1['id']}/tags/{bug_tag['id']}")
        client.post(f"/api/tickets/{ticket2['id']}/tags/{feature_tag['id']}")
        client.post(f"/api/tickets/{ticket3['id']}/tags/{bug_tag['id']}")

        # Filter by bug tag
        response = client.get(f"/api/tickets?tags={bug_tag['id']}")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["tickets"]) == 2
