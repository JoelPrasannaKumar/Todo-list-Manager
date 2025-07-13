// Enhanced form validation and user experience

document.addEventListener('DOMContentLoaded', function() {
    // Password confirmation validation for signup
    const signupForm = document.querySelector('form[action="/signup"]');
    if (signupForm) {
        const password = signupForm.querySelector('#password');
        const confirmPassword = signupForm.querySelector('#confirmPassword');
        
        function validatePasswords() {
            if (password.value !== confirmPassword.value) {
                confirmPassword.setCustomValidity('Passwords do not match');
            } else {
                confirmPassword.setCustomValidity('');
            }
        }
        
        password.addEventListener('input', validatePasswords);
        confirmPassword.addEventListener('input', validatePasswords);
    }
    
    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 300);
        }, 5000);
    });
    
    // Enhanced task input experience
    const taskInput = document.querySelector('.task-input');
    if (taskInput) {
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.closest('form').submit();
            }
        });
        
        // Auto-focus on task input
        taskInput.focus();
    }
    
    // Smooth animations for task items
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Confirm delete with better UX
    const deleteForms = document.querySelectorAll('.delete-form');
    deleteForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const taskText = this.closest('.task-item').querySelector('.task-text').textContent;
            if (!confirm(`Are you sure you want to delete "${taskText}"?`)) {
                e.preventDefault();
            }
        });
    });
    
    // Real-time task statistics update
    function updateTaskStats() {
        const totalTasks = document.querySelectorAll('.task-item').length;
        const completedTasks = document.querySelectorAll('.task-item.completed').length;
        const statsElement = document.querySelector('.tasks-stats p');
        
        if (statsElement && totalTasks > 0) {
            statsElement.textContent = `${completedTasks} of ${totalTasks} tasks completed`;
        }
    }
    
    // Update stats when checkboxes change
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Add visual feedback before form submission
            const taskItem = this.closest('.task-item');
            if (this.checked) {
                taskItem.style.transition = 'all 0.3s ease';
                taskItem.classList.add('completed');
            } else {
                taskItem.classList.remove('completed');
            }
            
            // Small delay to show the visual change before page reload
            setTimeout(() => {
                this.closest('form').submit();
            }, 150);
        });
    });
    
    // Loading state for forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Loading...';
                submitBtn.disabled = true;
                
                // Re-enable after 3 seconds as fallback
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    });
});

// Utility function for smooth scrolling
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to quickly add task
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const addTaskForm = document.querySelector('.add-task-form');
        if (addTaskForm) {
            addTaskForm.submit();
        }
    }
    
    // Escape to focus on task input
    if (e.key === 'Escape') {
        const taskInput = document.querySelector('.task-input');
        if (taskInput) {
            taskInput.focus();
            taskInput.select();
        }
    }
});