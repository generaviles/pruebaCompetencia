// script.js - Lógica del juego

document.addEventListener('DOMContentLoaded', () => {
    const levels = [
        {
            mainProduct: 'Jugo de naranja',
            mainProductImage: 'orange_juice.png',
            elements: [
                { name: 'Jugo de manzana', type: 'direct', image: 'apple_juice.png' },
                { name: 'Jugo en botella', type: 'direct', image: 'bottled_juice.png' },
                { name: 'Refresco', type: 'indirect', image: 'soda.png' },
                { name: 'Té', type: 'indirect', image: 'tea.png' },
                { name: 'Agua', type: 'indirect', image: 'water.png' },
                { name: 'Jugo de uva', type: 'direct', image: 'grape_juice.png' }
            ]
        },
        {
            mainProduct: 'Pizzería artesanal',
            mainProductImage: 'artisan_pizza.png',
            elements: [
                { name: 'Pizzería comercial', type: 'direct', image: 'commercial_pizza.png' },
                { name: 'Food truck de pizza', type: 'direct', image: 'pizza_truck.png' },
                { name: 'Hamburguesas', type: 'indirect', image: 'burger.png' },
                { name: 'Sushi', type: 'indirect', image: 'sushi.png' },
                { name: 'Tacos', type: 'indirect', image: 'tacos.png' },
                { name: 'Pizza congelada', type: 'direct', image: 'frozen_pizza.png' }
            ]
        },
        {
            mainProduct: 'Transporte escolar',
            mainProductImage: 'school_transport.png',
            elements: [
                { name: 'Camioneta escolar', type: 'direct', image: 'school_van.png' },
                { name: 'Uber', type: 'indirect', image: 'uber.png' },
                { name: 'Bicicleta', type: 'indirect', image: 'bicycle.png' },
                { name: 'Autobús público', type: 'indirect', image: 'public_bus.png' },
                { name: 'Taxi', type: 'indirect', image: 'taxi.png' },
                { name: 'Servicio de transporte privado', type: 'direct', image: 'private_transport.png' }
            ]
        },
        {
            mainProduct: 'Ropa deportiva',
            mainProductImage: 'sportswear.png',
            elements: [
                { name: 'Marca local de ropa deportiva', type: 'direct', image: 'local_sportswear.png' },
                { name: 'Ropa casual', type: 'indirect', image: 'casual_wear.png' },
                { name: 'Zapatos deportivos', type: 'indirect', image: 'sport_shoes.png' },
                { name: 'Accesorios deportivos', type: 'indirect', image: 'sport_accessories.png' },
                { name: 'Tienda de artículos deportivos', type: 'direct', image: 'sporting_goods_store.png' },
                { name: 'Ropa de yoga', type: 'direct', image: 'yoga_wear.png' }
            ]
        },
        {
            mainProduct: 'Tutoría educativa',
            mainProductImage: 'educational_tutoring.png',
            elements: [
                { name: 'Cursos en línea del mismo tema', type: 'direct', image: 'online_courses.png' },
                { name: 'Apps de organización', type: 'indirect', image: 'organization_apps.png' },
                { name: 'Videos de YouTube', type: 'indirect', image: 'youtube_videos.png' },
                { name: 'Libros de texto', type: 'indirect', image: 'textbooks.png' },
                { name: 'Clases particulares', type: 'direct', image: 'private_classes.png' },
                { name: 'Grupos de estudio', type: 'indirect', image: 'study_groups.png' }
            ]
        }
    ];

    let currentLevel = 0;
    let score = 0;

    const levelIndicator = document.getElementById('level-indicator');
    const mainProductDisplay = document.getElementById('main-product-display');
    const draggableElementsContainer = document.getElementById('draggable-elements-container');
    const directCompetitionZone = document.getElementById('direct-competition');
    const indirectCompetitionZone = document.getElementById('indirect-competition');
    const feedbackMessage = document.getElementById('feedback-message');
    const nextLevelButton = document.getElementById('next-level-button');

    function loadLevel(levelIndex) {
        currentLevel = levelIndex;
        if (currentLevel < levels.length) {
            const level = levels[currentLevel];
            levelIndicator.textContent = `Nivel: ${currentLevel + 1}`;
            mainProductDisplay.innerHTML = `<img src="images/${level.mainProductImage}" alt="${level.mainProduct}"><h3>${level.mainProduct}</h3>`;
            draggableElementsContainer.innerHTML = '';
            directCompetitionZone.innerHTML = '<h3>Competencia Directa</h3>';
            indirectCompetitionZone.innerHTML = '<h3>Competencia Indirecta</h3>';
            feedbackMessage.textContent = '';
            nextLevelButton.style.display = 'none';

            level.elements.forEach(element => {
                const draggableItem = document.createElement('div');
                draggableItem.classList.add('draggable-item');
                draggableItem.setAttribute('draggable', 'true');
                draggableItem.dataset.type = element.type;
                draggableItem.innerHTML = `<img src="images/${element.image}" alt="${element.name}"><p>${element.name}</p>`;
                draggableElementsContainer.appendChild(draggableItem);
            });
            addDragAndDropListeners();
        } else {
            // Game finished
            feedbackMessage.textContent = `¡Juego Terminado! Tu puntuación final es: ${score} de ${levels.length * 6}`;
            feedbackMessage.className = 'success';
            nextLevelButton.style.display = 'none';
            
            // Show final score and restart option
            setTimeout(() => {
                const restartButton = document.createElement('button');
                restartButton.textContent = 'Reiniciar Juego';
                restartButton.id = 'restart-button';
                restartButton.style.cssText = `
                    background: linear-gradient(145deg, #74b9ff 0%, #0984e3 100%);
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 1em;
                    font-weight: 600;
                    margin-top: 15px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 8px rgba(116, 185, 255, 0.3);
                `;
                restartButton.addEventListener('click', () => {
                    currentLevel = 0;
                    score = 0;
                    restartButton.remove();
                    loadLevel(currentLevel);
                });
                document.querySelector('footer').appendChild(restartButton);
            }, 1000);
        }
    }

    function addDragAndDropListeners() {
        const draggableItems = document.querySelectorAll('.draggable-item');
        const dropZones = document.querySelectorAll('.drop-zone');

        draggableItems.forEach(item => {
            item.addEventListener('dragstart', dragStart);
        });

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', dragOver);
            zone.addEventListener('dragleave', dragLeave);
            zone.addEventListener('drop', drop);
        });
    }

    let draggedItem = null;

    function dragStart(e) {
        draggedItem = this;
        setTimeout(() => this.classList.add('dragging'), 0);
    }

    function dragOver(e) {
        e.preventDefault();
        this.classList.add('hover');
    }

    function dragLeave() {
        this.classList.remove('hover');
    }

    function drop(e) {
        e.preventDefault();
        this.classList.remove('hover');

        if (draggedItem) {
            const droppedZoneType = this.id === 'direct-competition' ? 'direct' : 'indirect';
            const draggedItemType = draggedItem.dataset.type;

            this.appendChild(draggedItem);
            draggedItem.classList.remove('dragging');

            checkLevelCompletion();
        }
    }

    function checkLevelCompletion() {
        const currentLevelElements = levels[currentLevel].elements.length;
        const droppedElements = directCompetitionZone.querySelectorAll('.draggable-item').length +
                                indirectCompetitionZone.querySelectorAll('.draggable-item').length;

        if (droppedElements === currentLevelElements) {
            evaluateLevel();
        }
    }

    function evaluateLevel() {
        let correctCount = 0;
        const currentLevelElements = levels[currentLevel].elements.length;

        directCompetitionZone.querySelectorAll('.draggable-item').forEach(item => {
            if (item.dataset.type === 'direct') {
                correctCount++;
                item.style.backgroundColor = '#d4edda'; // Green for correct
                item.classList.add('bounce');
            } else {
                item.style.backgroundColor = '#f8d7da'; // Red for incorrect
            }
        });

        indirectCompetitionZone.querySelectorAll('.draggable-item').forEach(item => {
            if (item.dataset.type === 'indirect') {
                correctCount++;
                item.style.backgroundColor = '#d4edda'; // Green for correct
                item.classList.add('bounce');
            } else {
                item.style.backgroundColor = '#f8d7da'; // Red for incorrect
            }
        });

        score += correctCount;

        if (correctCount === currentLevelElements) {
            feedbackMessage.textContent = '¡Correcto! Todos los elementos están en la categoría correcta.';
            feedbackMessage.className = 'success';
        } else {
            feedbackMessage.textContent = `Incorrecto. Has acertado ${correctCount} de ${currentLevelElements} elementos.`;
            feedbackMessage.className = 'error';
        }
        nextLevelButton.style.display = 'block';
        
        // Remove bounce animation after it completes
        setTimeout(() => {
            document.querySelectorAll('.bounce').forEach(item => {
                item.classList.remove('bounce');
            });
        }, 600);
    }

    nextLevelButton.addEventListener('click', () => {
        loadLevel(currentLevel + 1);
    });

    // Add touch support for mobile devices
    function addTouchSupport() {
        let draggedElement = null;
        
        document.addEventListener('touchstart', (e) => {
            const target = e.target.closest('.draggable-item');
            if (target) {
                draggedElement = target;
                target.classList.add('dragging');
                e.preventDefault();
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (draggedElement) {
                e.preventDefault();
                const touch = e.touches[0];
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                const dropZone = elementBelow?.closest('.drop-zone');
                
                // Remove hover class from all drop zones
                document.querySelectorAll('.drop-zone').forEach(zone => {
                    zone.classList.remove('hover');
                });
                
                // Add hover class to current drop zone
                if (dropZone) {
                    dropZone.classList.add('hover');
                }
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (draggedElement) {
                const touch = e.changedTouches[0];
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                const dropZone = elementBelow?.closest('.drop-zone');
                
                if (dropZone) {
                    dropZone.appendChild(draggedElement);
                    checkLevelCompletion();
                }
                
                draggedElement.classList.remove('dragging');
                document.querySelectorAll('.drop-zone').forEach(zone => {
                    zone.classList.remove('hover');
                });
                draggedElement = null;
            }
        });
    }

    // Initial load
    loadLevel(currentLevel);
    addTouchSupport();
});

